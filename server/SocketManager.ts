import { Server as SocketServer } from 'socket.io'
import GameManager from './GameManager.js'

export default class SocketManager {
    socketServer: SocketServer
    gameManager: GameManager

    constructor(httpServer) {
        this.socketServer = new SocketServer(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        })
        this.gameManager = new GameManager(this.socketServer)
    }

    listen() {
        this.socketServer.on('connection', (socket) => {
            console.log('a user connected')

            socket.on('disconnect', () => {
                console.log('user disconnected')
            })

            socket.on('create game', async () => {
                const gid = await this.gameManager.createGame()
                socket.emit('game created', gid)
            })

            socket.on('join', (gid: string) => {
                console.log(`joining game ${gid}`)
                socket.join(gid)
            })

            socket.on('send message', (msg: string, gid: string) => {
                this.socketServer.to(gid).emit('receive message', msg)
            })

            socket.on('start game', (gid: string) => {
                this.gameManager.startGame(gid)
            })

            socket.on('submit guess', (gid: string, guess: string) => {
                if(this.gameManager.validateGuess(gid, guess)) {
                    socket.emit('valid guess')
                }
                else {
                    socket.emit('invalid guess')
                }
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
