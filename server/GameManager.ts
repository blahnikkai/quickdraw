import { Server as SocketServer } from 'socket.io'
import { promises as fs } from 'fs'
import Game from './Game.js'

export default class GameManager {
    socketServer: SocketServer
    games: Map<string, Game>
    dictionary: Set<string>
    twoLetCnts: Map<string, number>

    constructor(socketServer) {
        this.socketServer = socketServer
        this.games = new Map()
    }

    async loadSeqCnts() {
        
        const twoLetData = await fs.readFile('./dictionary/two_let_cnts.json', { encoding: 'utf-8' })
        this.twoLetCnts = new Map(Object.entries(JSON.parse(twoLetData)))

        const dictionaryData = await fs.readFile('./dictionary/popular.txt', { encoding: 'utf-8' })
        const wordLst = dictionaryData.split('\n')
        this.dictionary = new Set(wordLst)
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
        const newGame = new Game(gid, this.socketServer, this.dictionary, this.twoLetCnts)
        this.games.set(gid, newGame)
        return gid
    }
}
