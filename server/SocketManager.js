import { Server as SocketServer } from 'socket.io'
import GameManager from './GameManager.js'

export default class SocketManager {
    constructor(httpServer) {
        this.socketServer = new SocketServer(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        })
        this.gameManager = new GameManager()
    }

    listen() {
        this.socketServer.on('connection', (socket) => {
            console.log('a user connected')

            socket.on('disconnect', () => {
                console.log('user disconnected')
            })

            socket.on('create game', () => {
                const gid = this.gameManager.createGame(socket)
                socket.join(gid)
                socket.emit('game created', gid)
            })

            socket.on('join', (gid) => {
                console.log(`joining game ${gid}`)
                socket.join(gid)
            })

            socket.on('send message', (msg, gid) => {
                this.socketServer.to(gid).emit('receive message', msg)
            })

            socket.onAny((eventName, ...args) => {
                console.log(eventName, args)
            })

            socket.onAnyOutgoing((eventName, ...args) => {
                console.log(eventName, args)
            })
        })
    }
}
