import { Socket } from 'socket.io'

export default class User {
    name: string
    socket: Socket

    constructor(name: string, socket: Socket) {
        this.name = name
        this.socket = socket
    }
}