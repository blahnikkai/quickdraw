import { Socket } from "socket.io";
import Player from "./Player.js";
import GuessStatus from "../src/GuessStatus.js";
import { THREE_LET_PROB, POST_ROUND_TIME, ROUND_TIME } from "./constants.js";
import GameStatus from "../src/GameStatus.js";

const letters = "abcdefghijklmnopqrstuvwxyz";

export default class Game {
    gid: string;
    phrase: string;
    socketServer: any;
    dictionary: Set<string>;
    twoLetCnts: Map<string, number>;
    threeLetCnts: Map<string, number>;
    used: Set<string>;
    validCnt: number;
    timeoutId: ReturnType<typeof setTimeout>;
    players: Map<string, Player>;

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
        } else if (this.aliveCnt === 1) {
            const winner = Array.from(this.players.values()).find(
                (player) => player.aliveAndPlaying
            );
            this.endGame(winner);
            return true;
        }
        return false;
    }

    startRound(firstRound: boolean = false) {
        this.validCnt = 0;
        this.used.clear();
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
        this.timeoutId = setTimeout(() => {
            this.endRound();
        }, ROUND_TIME * 1_000);
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

    generatePhrase(): string {
        const phraseLen = Math.random() < THREE_LET_PROB ? 3 : 2;
        const letCnts = phraseLen === 3 ? this.threeLetCnts : this.twoLetCnts;
        let phrase = "";
        do {
            phrase = this.randomPhrase(phraseLen);
        } while (letCnts.get(phrase) < 1500);
        return phrase;
    }

    checkGuess(guess: string, socket: Socket) {
        let guessStatus: GuessStatus = undefined;
        if (this.used.has(guess)) {
            guessStatus = GuessStatus.USED;
        } else if (this.dictionary.has(guess) && guess.includes(this.phrase)) {
            this.validCnt++;
            this.used.add(guess);
            guessStatus = GuessStatus.VALID;
        } else {
            guessStatus = GuessStatus.INVALID;
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
            (this.playerCnt > 1 && this.aliveCnt - this.validCnt === 1) ||
            (this.playerCnt === 1 && this.validCnt === 1)
        ) {
            console.log("ending round early");
            this.endRound();
        }
    }

    get playerCnt(): number {
        return this.players.size;
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

    changeName(newName: string, socket: Socket) {
        this.players.get(socket.id).setName(newName);
        this.changeGameStatus(GameStatus.WAITING, socket);
        this.emitPlayerInfo();
    }

    changeGameStatus(newStatus: GameStatus, socket: Socket) {
        this.players.get(socket.id).setGameStatus(newStatus);
        // move player to end of list so that players show in the order they ready up
        const player: Player = this.players.get(socket.id);
        this.players.delete(socket.id);
        const playerArr = Array.from(this.players);
        playerArr.splice(this.players.size + 1, 0, [socket.id, player]);
        this.players = new Map(playerArr);
    }
}
