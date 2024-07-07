const letters = 'abcdefghijklmnopqrstuvwxyz'

export default class Game {
    gid: string
    phrase: string
    socketServer: any
    dictionary: Set<string>
    twoLetCnts: Map<string, number>
    used: Set<string>

    constructor(gid: string, socketServer: any, dictionary: Set<string>, twoLetCnts: Map<string, number>) {
        this.gid = gid
        this.phrase = ''
        this.dictionary = dictionary
        this.socketServer = socketServer
        this.twoLetCnts = twoLetCnts
        this.used = new Set()
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
        this.generatePhrase()
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
            this.used.add(guess)
            return 'valid'
        }
        return 'invalid'
    }
}