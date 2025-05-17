import { Server as SocketServer, Socket } from "socket.io";
import { Server } from "node:http";
import GameManager from "./GameManager.js";
import GameStatus from "../src/GameStatus.js";
import Difficulty from "../src/Difficulty.js";

export default class SocketManager {
    socketServer: SocketServer;
    gameManager: GameManager;

    constructor(httpServer: Server) {
        this.socketServer = new SocketServer(httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });
        this.gameManager = new GameManager(this.socketServer);
    }

    listen() {
        this.socketServer.on("connection", (socket: Socket) => {
            console.log("a user connected");

            socket.on("disconnect", () => {
                console.log("user disconnected");
                this.gameManager.disconnect(socket);
            });

            socket.on("create game", async () => {
                const gid = await this.gameManager.createGame();
                socket.emit("game created", gid);
            });

            socket.on("join", (gid: string) => {
                this.gameManager.joinGame(gid, socket);
            });

            socket.on("check room exists", (gid: string) => {
                if(this.gameManager.gameExists(gid)) {
                    socket.emit("room exists")
                }
                else {
                    socket.emit("room dne")
                }
            });

            socket.on("leave", (gid: string) => {
                this.gameManager.leaveGame(gid, socket);
            });

            socket.on("start game", (gid: string) => {
                this.gameManager.startGame(gid);
            });

            socket.on("submit guess", (gid: string, guess: string) => {
                this.gameManager.checkGuess(gid, guess, socket);
            });

            socket.on("submit name", (gid: string, newName: string) => {
                this.gameManager.changeName(gid, newName, socket);
            });

            socket.on(
                "change game status",
                (gid: string, newStatus: GameStatus) => {
                    this.gameManager.changeGameStatus(gid, newStatus, socket);
                }
            );

            socket.on(
                "update settings",
                (gid: string, difficulty: Difficulty, roundTime: number, startingLives: number) => {
                    this.gameManager.updateSettings(gid, difficulty, roundTime, startingLives);
                }
            );

            socket.onAny((eventName: string, ...args: any[]) => {
                console.log("in: ", eventName, args);
            });

            socket.onAnyOutgoing((eventName: string, ...args: any[]) => {
                console.log("out: ", eventName, args);
            });
        });
    }
}
