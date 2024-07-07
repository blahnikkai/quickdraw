const letters = 'abcdefghijklmnopqrstuvwxyz'

export default class Game {
    gid: string
    phrase: string

    constructor(gid: string) {
        this.gid = gid
        this.phrase = ''
    }

    randomLetter(): string {
        const ind = Math.floor(Math.random() * 26)
        return letters[ind]
    }

    randomPhrase(length: number) {
        const letters = []
        for (let i = 0; i < length; i++) {
            letters.push(this.randomLetter())
        }
        return letters.join('')
    }

    generatePhrase(twoLetCnts: Map<string, number>) {
        let phrase = ''
        do {
            phrase = this.randomPhrase(2)
        } while(twoLetCnts.get(phrase) < 50)
        this.phrase = phrase
    }
}