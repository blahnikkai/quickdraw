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

    startRound(): boolean {
        if(this.dead) {
            return
        }
        if (this.lastGuessStatus !== GuessStatus.VALID) {
            this.lives--
            if (this.lives === 0) {
                this.dead = true
            }
        }
        this.lastGuess = ''
        this.lastGuessStatus = undefined
        this.dying = false
        return !this.dead
    }

    checkDying() {
        this.dying = !this.dead && this.lastGuessStatus !== GuessStatus.VALID
    }
}
