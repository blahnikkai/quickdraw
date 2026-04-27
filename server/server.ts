import express from "express";
import { createServer } from "node:http";
import SocketManager from "./SocketManager.js";
import cors from 'cors';

const app = express();
app.use(cors());

app.get("/test", function (request, response) {
    response.send("bello!!!")
});

const server = createServer(app);
const socketManager = new SocketManager(server);

socketManager.listen();

// all addresses
// const ip = "0.0.0.0";
// we can do localhost because requests are reverse proxied by nginx 
// so requests to the server will be coming through the localhost interface from nginx
const ip = "localhost";
const port = 3001;
server.listen(port, ip, () => {
    console.log(`server running at http://${ip}:${port}`);
});
