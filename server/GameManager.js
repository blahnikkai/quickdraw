import Game from './Game.js'

export default class GameManager {
    constructor() {
        this.games = new Map()
    }

    async loadSeqCnts() {
        const response = await fetch('./dictionary/two_let_cnts.json')
        const json = await response.json()
        this.twoLetCnts = new Map(Object.entries(json));
    }

    async createGame() {
        // n = number of characters in gid
        const n = 5
        let gid = ''
        do {
            gid = Math.floor(
                (10 ** n - 10 ** (n - 1)) * Math.random() + 10 ** (n - 1)
            ).toString()
        } while (this.games.has(gid))
        if(this.twoLetCnts === undefined) {
            await this.loadSeqCnts()
        }
        const newGame = new Game(gid)
        this.games.set(gid, newGame)
        return gid
    }
}
