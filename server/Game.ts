import { Socket } from 'socket.io'
import Player from './Player.js'

const letters = 'abcdefghijklmnopqrstuvwxyz'

export default class Game {
    gid: string
    phrase: string
    socketServer: any
    dictionary: Set<string>
    twoLetCnts: Map<string, number>
    used: Set<string>
    validCnt: number
    timeoutId: ReturnType<typeof setTimeout>
    players: Map<string, Player>

    constructor(gid: string, socketServer: any, dictionary: Set<string>, twoLetCnts: Map<string, number>) {
        this.gid = gid
        this.phrase = ''
        this.dictionary = dictionary
        this.socketServer = socketServer
        this.twoLetCnts = twoLetCnts
        this.used = new Set()
        this.validCnt = 0
        this.players = new Map()
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

    newGame() {
        this.players.forEach((player: Player) => {
            player.reset()
        })
        this.emitPlayerInfo()
        this.socketServer.in(this.gid).emit('new game')
    }

    startGame() {
        this.startRound(true)
        this.socketServer.to(this.gid).emit('game started')
    }

    endGame() {
        const winner = Array.from(this.players.values()).find((player) => !player.dead)
        this.socketServer.to(this.gid).emit('game ended', winner)
    }

    startRound(firstRound: boolean = false) {
        this.validCnt = 0
        this.used.clear()
        let aliveCnt = 0
        if (!firstRound) {
            this.players.forEach((player) => {
                if(player.dead) {
                    return
                }
                if (player.status !== 'valid') {
                    player.lives--
                    if (player.lives === 0) {
                        player.dead = true
                    }
                }
                player.lastGuess = ''
                player.status = ''
                player.dying = false
                if(!player.dead) {
                    aliveCnt++
                }
            })
            this.emitPlayerInfo()
        }
        if(aliveCnt === 1) {
            this.endGame()
            return
        }
        this.generatePhrase()
        this.timeoutId = setTimeout(() => {
            this.endRound()
        }, 20_000)
    }

    endRound() {
        this.socketServer.to(this.gid).emit('end round')
        clearTimeout(this.timeoutId)
        this.players.forEach((player) => {
            if (!player.dead && player.status !== 'valid') {
                player.dying = true
            }
        })
        this.emitPlayerInfo()
        setTimeout(() => {
            this.startRound()
        }, 1_000)
    }

    generatePhrase() {
        let phrase = ''
        do {
            phrase = this.randomPhrase(2)
        } while (this.twoLetCnts.get(phrase) < 50)
        this.socketServer.to(this.gid).emit('start round', phrase)
        this.phrase = phrase
    }

    checkGuess(guess: string, socket: Socket) {
        let status = ''
        if (this.used.has(guess)) {
            status = 'used'
        }
        else if (this.dictionary.has(guess) && guess.includes(this.phrase)) {
            this.validCnt++
            this.used.add(guess)
            status = 'valid'
        }
        else {
            status = 'invalid'
        }
        this.players.get(socket.id).lastGuess = guess
        this.players.get(socket.id).status = status
        this.emitPlayerInfo()
        if (status === 'valid') {
            this.checkRoundOver()
        }
    }

    checkRoundOver() {
        // only 1 player left
        if ((this.playerCnt > 1 && this.aliveCnt - this.validCnt === 1) || (this.playerCnt === 1 && this.validCnt === 1)) {
            console.log('ending round early')
            this.endRound()
        }
    }

    get playerCnt(): number {
        return this.players.size
    }

    get aliveCnt(): number {
        return Array.from(this.players.values()).reduce((cnt, player) => cnt += !player.dead ? 1 : 0, 0)
    }

    joinGame(socket: Socket) {
        console.log(`joining game ${this.gid}`)
        socket.join(this.gid)
        socket.emit('room joined')
        this.players.set(socket.id, new Player(socket.id))
        this.emitPlayerInfo()
    }

    leaveGame(socket: Socket) {
        socket.leave(this.gid)
        this.players.delete(socket.id)
        this.emitPlayerInfo()
    }

    emitPlayerInfo() {
        const playerInfo = Array.from(this.players.values());
        this.socketServer.to(this.gid).emit('update player info', playerInfo)
    }

    changeName(newName: string, socket: Socket) {
        this.players.get(socket.id).name = newName
        this.emitPlayerInfo()
    }
}