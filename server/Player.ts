export default class Player {
    socketId: string
    name: string
    lastGuess: string
    status: string
    lives: number
    dying: boolean
    dead: boolean

    constructor(socketId: string) {
        this.socketId = socketId
        this.name = 'Player'
        this.lastGuess = ''
        this.status = ''
        this.lives = 2
        this.dying = false
        this.dead = false
    }

    reset() {
        this.lives = 2
        this.dead = false
    }
}
