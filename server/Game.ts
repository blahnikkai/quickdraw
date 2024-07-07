const letters = 'abcdefghijklmnopqrstuvwxyz'

export default class Game {
    gid: string
    phrase: string
    socketServer: any
    dictionary: Set<string>
    twoLetCnts: Map<string, number>
    used: Set<string>
    playerCnt: number
    validCnt: number
    timeoutId: ReturnType<typeof setTimeout>

    constructor(gid: string, socketServer: any, dictionary: Set<string>, twoLetCnts: Map<string, number>) {
        this.gid = gid
        this.phrase = ''
        this.dictionary = dictionary
        this.socketServer = socketServer
        this.twoLetCnts = twoLetCnts
        this.used = new Set()
        this.playerCnt = 0
        this.validCnt = 0
    }

    randomLetter(): string {
        const ind = Math.floor(Math.random() * 26)
        return letters[ind]
    }

    randomPhrase(length: number): string {
        const letters = []
        for (let i = 0; i < length; i++) {
            letters.push(this.randomLetter())
        }
        return letters.join('')
    }

    startGame() {
        this.startRound()
    }

    startRound() {
        this.validCnt = 0
        this.used.clear()
        this.generatePhrase()
        this.timeoutId = setTimeout(() => {
            this.endRound()
        }, 20_000)
    }

    endRound() {
        this.socketServer.to(this.gid).emit('end round')
        clearTimeout(this.timeoutId)
        setTimeout(() => {
            this.startRound()
        }, 1_000)
    }

    generatePhrase() {
        let phrase = ''
        do {
            phrase = this.randomPhrase(2)
        } while(this.twoLetCnts.get(phrase) < 50)
        this.socketServer.to(this.gid).emit('new phrase', phrase)
        this.phrase = phrase
    }

    checkGuess(guess: string): string {
        if(this.used.has(guess)) {
            return 'used'
        }
        if(this.dictionary.has(guess) && guess.includes(this.phrase)) {
            this.validCnt++
            this.used.add(guess)
            return 'valid'
        }
        return 'invalid'
    }

    checkGameOver() {
        // only 1 player left
        console.log('checking game over')
        console.log(this.playerCnt)
        console.log(this.validCnt)
        if(this.playerCnt - this.validCnt === 1) {
            console.log('ending round early')
            this.endRound()
        }
    }

    joinGame() {
        this.playerCnt++
    }
}