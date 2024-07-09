import { Server as SocketServer, Socket } from 'socket.io'
import { Server } from 'node:http'
import GameManager from './GameManager.js'

export default class SocketManager {
    socketServer: SocketServer
    gameManager: GameManager

    constructor(httpServer: Server) {
        this.socketServer = new SocketServer(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        })
        this.gameManager = new GameManager(this.socketServer)
    }

    listen() {
        this.socketServer.on('connection', (socket: Socket) => {
            console.log('a user connected')

            socket.on('disconnect', () => {
                console.log(`user disconnected`)
                this.gameManager.disconnect(socket)
            })

            socket.on('create game', async () => {
                const gid = await this.gameManager.createGame()
                socket.emit('game created', gid)
            })

            socket.on('join', (gid: string) => {
                this.gameManager.joinGame(gid, socket)
            })

            socket.on('leave', (gid: string) => {
                this.gameManager.leaveGame(gid, socket)
            })

            socket.on('send message', (msg: string, gid: string) => {
                this.socketServer.to(gid).emit('receive message', msg)
            })

            socket.on('start game', (gid: string) => {
                this.gameManager.startGame(gid)
            })

            socket.on('submit guess', (gid: string, guess: string) => {
                this.gameManager.checkGuess(gid, guess, socket)
            })

            socket.on('change name', (gid: string, newName: string) => {
                this.gameManager.changeName(gid, newName, socket)
            })

            socket.onAny((eventName: string, ...args: any[]) => {
                console.log(eventName, args)
            })

            socket.onAnyOutgoing((eventName: string, ...args: any[]) => {
                console.log(eventName, args)
            })

        })
    }
}
