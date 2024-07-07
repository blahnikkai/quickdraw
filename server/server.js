import express from 'express'
import {createServer} from 'node:http'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'
import SocketManager from './SocketManager.js'

const app = express()
const server = createServer(app)
const socketManager = new SocketManager(server)

const __dirname = dirname(fileURLToPath(import.meta.url))

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'))
})

socketManager.listen()

server.listen(3001, () => {
    console.log('server running at http://localhost:3001')
})
