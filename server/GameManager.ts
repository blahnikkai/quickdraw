import { Server as SocketServer, Socket } from "socket.io";
import { promises as fs } from "fs";
import Game from "./Game.js";
import GameStatus from "../src/GameStatus.js";
import Difficulty from "../src/Difficulty.js";

export default class GameManager {
    socketServer: SocketServer;
    games: Map<string, Game>;
    dictionary: Set<string>;
    twoLetCnts: Map<string, number>;
    threeLetCnts: Map<string, number>;

    constructor(socketServer: SocketServer) {
        this.socketServer = socketServer;
        this.games = new Map();
    }

    async loadSeqCnts() {
        const twoLetData = await fs.readFile("./dictionary/two_let_cnts.json", {
            encoding: "utf-8",
        });
        this.twoLetCnts = new Map(Object.entries(JSON.parse(twoLetData)));

        const threeLetData = await fs.readFile(
            "./dictionary/three_let_cnts.json",
            { encoding: "utf-8" }
        );
        this.threeLetCnts = new Map(Object.entries(JSON.parse(threeLetData)));

        const dictionaryData = await fs.readFile("./dictionary/enable1.txt", {
            encoding: "utf-8",
        });
        const wordLst = dictionaryData.split("\n");
        this.dictionary = new Set(wordLst);
    }

    async createGame() {
        // n = number of characters in gid
        const n = 5;
        let gid = "";
        do {
            gid = Math.floor(
                (10 ** n - 10 ** (n - 1)) * Math.random() + 10 ** (n - 1)
            ).toString();
        } while (this.games.has(gid));
        if (this.twoLetCnts === undefined) {
            await this.loadSeqCnts();
        }
        const newGame = new Game(
            gid,
            this.socketServer,
            this.dictionary,
            this.twoLetCnts,
            this.threeLetCnts
        );
        this.games.set(gid, newGame);
        return gid;
    }

    startGame(gid: string) {
        this.games.get(gid).startGame();
    }

    checkGuess(gid: string, guess: string, socket: Socket) {
        this.games.get(gid).checkGuess(guess, socket);
    }

    gameExists(gid: string): boolean {
        return this.games.has(gid);
    }

    joinGame(gid: string, socket: Socket) {
        if (!this.gameExists(gid)) {
            socket.emit("room dne");
            return;
        }
        this.games.get(gid).joinGame(socket);
    }

    leaveGame(gid: string, socket: Socket) {
        console.log(`leaving game ${gid}`);
        if (!this.gameExists(gid)) {
            return;
        }
        this.games.get(gid).leaveGame(socket);
        // if there are 0 players in a game, and 1 second from now there are still 0 players, delete the game
        // the 1 second wait is because react useEffect causes almost instant join -> leave -> join
        if (this.games.get(gid).playerCnt === 0) {
            setTimeout(() => {
                console.log(this.games.keys());
                if (
                    this.gameExists(gid) &&
                    this.games.get(gid).playerCnt === 0
                ) {
                    console.log(`deleting game ${gid}`);
                    this.games.delete(gid);
                }
            }, 10_000);
        }
    }

    disconnect(socket: Socket) {
        this.games.forEach((game, gid) => {
            this.leaveGame(gid, socket);
        });
    }

    changeName(gid: string, newName: string, socket: Socket) {
        this.games.get(gid)?.changeName(newName, socket);
    }

    changeGameStatus(gid: string, newStatus: GameStatus, socket: Socket) {
        this.games.get(gid)?.changeGameStatus(newStatus, socket);
    }

    updateSettings(
        gid: string,
        difficulty: Difficulty,
        roundTime: number,
        startingLives: number
    ) {
        this.games
            .get(gid)
            ?.updateSettings(difficulty, roundTime, startingLives);
    }
}
