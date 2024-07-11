import GuessStatus from '../src/GuessStatus'

export default class Player {
    socketId: string
    name: string
    lives: number
    lastGuess: string
    lastGuessStatus: GuessStatus
    dying: boolean
    dead: boolean

    constructor(socketId: string) {
        this.socketId = socketId
        this.name = 'Player'
        this.lastGuess = ''
        this.lastGuessStatus = undefined
        this.lives = 2
        this.dying = false
        this.dead = false
    }

    reset() {
        this.lives = 2
        this.dead = false
    }
}
