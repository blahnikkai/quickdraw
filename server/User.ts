import { Socket } from 'socket.io'

export default class User {
    socket: Socket
    name: string
    lastGuess: string

    constructor(socket: Socket, name: string) {
        this.name = name
        this.socket = socket
        this.lastGuess = ''
    }
}