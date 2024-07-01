import express from 'express'
import {createServer} from 'node:http'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'
import {Server} from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

const __dirname = dirname(fileURLToPath(import.meta.url))

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'))
})

io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    socket.on('join', (game_id) => {
        console.log(`joining game ${game_id}`)
        socket.join(game_id)
    })

    socket.on('send message', (msg, game) => {
        io.to(game).emit('receive message', msg)
    })

    socket.onAny((eventName, ...args) => {
        console.log(eventName, args)
    })

    socket.onAnyOutgoing((eventName, ...args) => {
        console.log(eventName, args)
    })
})

server.listen(3001, () => {
    console.log('server running at http://localhost:3001')
})
