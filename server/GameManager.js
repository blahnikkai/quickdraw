import Game from './Game.js'

export default class GameManager {
    constructor() {
        this.games = new Map()
    }

    createGame() {
        const n = 5
        let gid = ''
        do {
            gid = Math.floor(
                (10 ** n - 10 ** (n - 1)) * Math.random() + 10 ** (n - 1)
            ).toString()
        } while (this.games.has(gid))
        this.games.set(gid, new Game(gid))
        return gid
    }
}
