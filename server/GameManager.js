import {promises as fs} from 'fs'
import Game from './Game.ts'

export default class GameManager {
    constructor(socketServer) {
        this.socketServer = socketServer
        this.games = new Map()
    }

    async loadSeqCnts() {
        const data = await fs.readFile('./dictionary/two_let_cnts.json')
        this.twoLetCnts = new Map(Object.entries(JSON.parse(data)))
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
        if (this.twoLetCnts === undefined) {
            await this.loadSeqCnts()
        }
        const newGame = new Game(gid, this.socketServer, this.twoLetCnts)
        this.games.set(gid, newGame)
        return gid
    }
}
