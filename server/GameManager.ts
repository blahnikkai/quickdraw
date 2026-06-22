import { Server as SocketServer, Socket } from "socket.io";
import fs from "fs";
import { promises } from "fs";
import csv from 'csv-parser';
import Game from "./Game.js";
import GameStatus from "../src/shared/GameStatus.js";
import Difficulty from "../src/shared/Difficulty.js";

export default class GameManager {
    socketServer: SocketServer;
    games: Map<string, Game>;
    dictionary: Set<string>;
    twoLetCnts: Map<string, number>;
    threeLetCnts: Map<string, number>;
    wordRarityMap: Map<string, number>;

    constructor(socketServer: SocketServer, dictionary: Set<string>, twoLetCnts: Map<string, number>, threeLetCnts: Map<string, number>, wordRarityMap: Map<string, number>) {
        this.socketServer = socketServer;
        this.games = new Map();
        this.dictionary = dictionary;
        this.twoLetCnts = twoLetCnts;
        this.threeLetCnts = threeLetCnts;
        this.wordRarityMap = wordRarityMap;
    }

    static async parseWordRarity(): Promise<Map<string, number>> {
        const wordRarityMap: Map<string, number> = new Map();
        const stream = fs.createReadStream("./dictionary/word_rarity_list.csv")
            .pipe(csv());

        for await (const row of stream) {
            const numAppearances = row["count"];
            const rarityScore = Math.log10(numAppearances / 430.8);
            wordRarityMap.set(row["word"], rarityScore);
        }

        return wordRarityMap;
    }

    static async create(socketServer: SocketServer) {
        const wordRarityMap = await GameManager.parseWordRarity();
        console.log(wordRarityMap);

        const twoLetData = await promises.readFile("./dictionary/two_let_cnts.json", {
            encoding: "utf-8",
        });
        const twoLetCnts: Map<string, number> = new Map(Object.entries(JSON.parse(twoLetData)));

        const threeLetData = await promises.readFile(
            "./dictionary/three_let_cnts.json",
            { encoding: "utf-8" }
        );
        const threeLetCnts: Map<string, number> = new Map(Object.entries(JSON.parse(threeLetData)));

        const dictionaryData = await promises.readFile("./dictionary/enable1.txt", {
            encoding: "utf-8",
        });
        const wordLst = dictionaryData.split("\n");
        const dictionary = new Set(wordLst);

        return new GameManager(socketServer, dictionary, twoLetCnts, threeLetCnts, wordRarityMap);
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
        const newGame = new Game(
            gid,
            this.socketServer,
            this.dictionary,
            this.twoLetCnts,
            this.threeLetCnts,
            this.wordRarityMap,
        );
        this.games.set(gid, newGame);
        return gid;
    }

    startGame(gid: string) {
        this.games.get(gid)?.startGame();
    }

    updatePartialGuess(gid: string, partialGuess: string, socket: Socket) {
        this.games.get(gid)?.updatePartialGuess(partialGuess, socket);
    }

    checkGuess(gid: string, guess: string, socket: Socket) {
        this.games.get(gid)?.checkGuess(guess, socket);
    }

    gameExists(gid: string): boolean {
        return this.games.has(gid);
    }

    joinGame(gid: string, socket: Socket) {
        if (!this.gameExists(gid)) {
            socket.emit("room dne");
            return;
        }
        this.games.get(gid)?.joinGame(socket);
    }

    leaveGame(gid: string, socket: Socket) {
        console.log(`leaving game ${gid}`);
        const game = this.games.get(gid);
        if (game == null) {
            return;
        }
        game.leaveGame(socket);
        if (game.curRound !== 0 && game.aliveCnt === 0) {
            game.endGame();
            console.log("ending game early");
        }

        // if there are 0 players in a game, and 1 second from now there are still 0 players, delete the game
        // the 1 second wait is because react useEffect causes almost instant join -> leave -> join
        if (game.playerCnt === 0) {
            setTimeout(() => {
                console.log(this.games.keys());
                if (
                    this.gameExists(gid) &&
                    game.playerCnt === 0
                ) {
                    console.log(`deleting game ${gid}`);
                    this.games.delete(gid);
                }
            }, 1_000);
        }
    }

    disconnect(socket: Socket) {
        this.games.forEach((_, gid) => {
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
