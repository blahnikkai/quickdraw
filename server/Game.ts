import { Socket } from "socket.io";
import Player from "./Player.js";
import GuessStatus from "../src/GuessStatus.js";
import { THREE_LET_PROB, POST_ROUND_TIME, ROUND_TIME } from "./constants.js";
import GameStatus from "../src/GameStatus.js";
import Difficulty from "../src/Difficulty.js";

const letters = "abcdefghijklmnopqrstuvwxyz";

export default class Game {
    gid: string;
    phrase: string;
    socketServer: any;
    dictionary: Set<string>;
    // TODO: could be static?
    twoLetCnts: Map<string, number>;
    threeLetCnts: Map<string, number>;
    used: Set<string>;
    validCnt: number;
    timeoutId: ReturnType<typeof setTimeout>;
    players: Map<string, Player>;
    curRound: number;
    difficulty: Difficulty;
    roundTime: number;
    startingLives: number;

    constructor(
        gid: string,
        socketServer: any,
        dictionary: Set<string>,
        twoLetCnts: Map<string, number>,
        threeLetCnts: Map<string, number>
    ) {
        this.gid = gid;
        this.phrase = "";
        this.dictionary = dictionary;
        this.socketServer = socketServer;
        this.twoLetCnts = twoLetCnts;
        this.threeLetCnts = threeLetCnts;
        this.used = new Set();
        this.validCnt = 0;
        this.players = new Map();
        this.curRound = 0;
        this.difficulty = Difficulty.DYNAMIC;
    }

    randomLetter(): string {
        const ind = Math.floor(Math.random() * 26);
        return letters[ind];
    }

    randomPhrase(length: number): string {
        const letters = [];
        for (let i = 0; i < length; i++) {
            letters.push(this.randomLetter());
        }
        return letters.join("");
    }

    startGame() {
        this.curRound = 1;
        this.used.clear();
        this.startRound(true);
        this.players.forEach((player) => {
            if (player.gameStatus == GameStatus.READY) {
                player.setGameStatus(GameStatus.PLAYING);
            }
            if (player.gameStatus == GameStatus.WAITING) {
                player.setGameStatus(GameStatus.SPECTATING);
            }
        });
        this.emitPlayerInfo();
    }

    endGame(winner: Player = undefined) {
        this.curRound = 0;
        this.players.forEach((player: Player) => {
            player.reset();
        });
        this.emitPlayerInfo();
        this.socketServer.to(this.gid).emit("game ended", winner);
    }

    checkGameOver(): boolean {
        if (this.aliveCnt === 0) {
            this.endGame();
            return true;
        } else if (this.aliveCnt === 1 && this.activePlayerCnt > 1) {
            const winner = Array.from(this.players.values()).find(
                (player) => player.aliveAndPlaying
            );
            this.endGame(winner);
            return true;
        }
        return false;
    }

    startRound(firstRound: boolean = false) {
        this.curRound++;
        this.validCnt = 0;
        if (!firstRound) {
            this.players.forEach((player) => {
                player.startRound();
            });
            this.emitPlayerInfo();
            if (this.checkGameOver()) {
                return;
            }
        }
        this.phrase = this.generatePhrase();
        this.socketServer
            .to(this.gid)
            .emit(
                "start round",
                this.phrase,
                Date.now(),
                Date.now() + ROUND_TIME * 1_000
            );
        this.emitDebugInfo();
        this.timeoutId = setTimeout(() => {
            this.endRound();
        }, ROUND_TIME * 1_000);
    }

    emitDebugInfo() {
        const [mnPhraseCnt, mxPhraseCnt] = this.calcMinAndMaxPhraseCnt();
        const debugInfo = `${this.calcPhraseCnt(
            this.phrase
        )}, ${mnPhraseCnt.toFixed(2)}-${mxPhraseCnt.toFixed(2)}`;
        this.socketServer.to(this.gid).emit("update debug info", debugInfo);
    }

    endRound() {
        this.socketServer.to(this.gid).emit("end round");
        clearTimeout(this.timeoutId);
        this.players.forEach((player) => {
            player.checkDying();
        });
        this.emitPlayerInfo();
        setTimeout(() => {
            this.startRound();
        }, POST_ROUND_TIME * 1_000);
    }

    calcMinAndMaxPhraseCnt(): number[] {
        if (this.difficulty === Difficulty.EASY) {
            return [3_000, 20_000];
        } else if (this.difficulty === Difficulty.MEDIUM) {
            return [1_500, 5_0000];
        } else if (this.difficulty === Difficulty.HARD) {
            return [500, 1_500];
        } else if (this.difficulty === Difficulty.DYNAMIC) {
            const decay = Math.pow(2, -this.curRound / 12);
            const mn = Math.max(2000 * decay, 500);
            const mx = Math.min(6000 * decay, 1_500);
            return [mn, mx];
        }
        throw Error("Shouldn't be here");
    }

    calcPhraseCnt(phrase: string) {
        const phraseCnts =
            phrase.length === 3 ? this.threeLetCnts : this.twoLetCnts;
        return phraseCnts.get(phrase);
    }

    generatePhrase(): string {
        const phraseLen = Math.random() < THREE_LET_PROB ? 3 : 2;
        let phrase = "";
        const [mnPhraseCnt, mxPhraseCnt] = this.calcMinAndMaxPhraseCnt();
        let curPhraseCnt = -1;
        do {
            phrase = this.randomPhrase(phraseLen);
            curPhraseCnt = this.calcPhraseCnt(phrase);
        } while (mnPhraseCnt > curPhraseCnt || curPhraseCnt > mxPhraseCnt);
        return phrase;
    }

    checkGuess(guess: string, socket: Socket) {
        let guessStatus: GuessStatus = undefined;
        if (!this.dictionary.has(guess) || !guess.includes(this.phrase)) {
            guessStatus = GuessStatus.INVALID;
        } else if (this.used.has(guess)) {
            guessStatus = GuessStatus.USED;
        } else {
            this.validCnt++;
            this.used.add(guess);
            guessStatus = GuessStatus.VALID;
        }
        this.players.get(socket.id).lastGuess = guess;
        this.players.get(socket.id).lastGuessStatus = guessStatus;
        this.emitPlayerInfo();
        if (guessStatus === GuessStatus.VALID) {
            this.checkRoundOver();
        }
    }

    checkRoundOver() {
        // only 1 player left
        if (
            (this.aliveCnt > 1 && this.aliveCnt - this.validCnt === 1) ||
            (this.aliveCnt === 1 && this.validCnt === 1)
        ) {
            console.log("ending round early");
            this.endRound();
        }
    }

    get playerCnt(): number {
        return this.players.size;
    }

    // only count playing players
    get activePlayerCnt(): number {
        let cnt = 0;
        for (const player of this.players.values()) {
            if (player.gameStatus == GameStatus.PLAYING) {
                cnt++;
            }
        }
        return cnt;
    }

    get aliveCnt(): number {
        let cnt = 0;
        // only count playing, alive players
        for (const player of this.players.values()) {
            if (player.aliveAndPlaying) {
                cnt++;
            }
        }
        return cnt;
    }

    joinGame(socket: Socket) {
        console.log(`joining game ${this.gid}`);
        socket.join(this.gid);
        socket.emit("room joined");
        this.players.set(socket.id, new Player(socket.id));
        this.emitPlayerInfo();
    }

    leaveGame(socket: Socket) {
        socket.leave(this.gid);
        this.players.delete(socket.id);
        this.emitPlayerInfo();
    }

    emitPlayerInfo() {
        const playerInfo = Array.from(this.players.values());
        this.socketServer.to(this.gid).emit("update player info", playerInfo);
    }

    emitPhrase(socketId: string) {
        this.socketServer.to(socketId).emit("update phrase", this.phrase);
    }

    changeName(newName: string, socket: Socket) {
        this.players.get(socket.id).setName(newName);
        const newStatus =
            this.curRound === 0 ? GameStatus.WAITING : GameStatus.SPECTATING;
        this.changeGameStatus(newStatus, socket);
        if (newStatus === GameStatus.SPECTATING) {
            this.emitPhrase(socket.id);
        }
    }

    changeGameStatus(newStatus: GameStatus, socket: Socket) {
        this.players.get(socket.id).setGameStatus(newStatus);
        this.emitPlayerInfo();
    }

    updateSettings(
        difficulty: Difficulty,
        roundTime: number,
        startingLives: number
    ) {
        this.difficulty = difficulty;
        this.roundTime = roundTime;
        this.startingLives = startingLives;
        this.socketServer.to(this.gid).emit(
            "broadcast settings change",
            difficulty,
            roundTime,
            startingLives,
        )
    }
}
