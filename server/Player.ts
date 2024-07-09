import { Socket } from 'socket.io'

export default class Player {
    socketId: string
    name: string
    lastGuess: string
    status: string
    lives: number

    constructor(socketId: string) {
        this.socketId = socketId
        this.name = 'Player'
        this.lastGuess = ''
        this.status = ''
        this.lives = 10
    }
}
