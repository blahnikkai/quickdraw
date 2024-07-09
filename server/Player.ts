export default class Player {
    socketId: string
    name: string
    lastGuess: string
    status: string
    lives: number
    dying: boolean

    constructor(socketId: string) {
        this.socketId = socketId
        this.name = 'Player'
        this.lastGuess = ''
        this.status = ''
        this.lives = 10
        this.dying = false
    }
}
