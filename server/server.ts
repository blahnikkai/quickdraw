import express from "express";
import { createServer } from "node:http";
import SocketManager from "./SocketManager.js";

const app = express();
const server = createServer(app);
const socketManager = new SocketManager(server);

socketManager.listen();

const ip = "0.0.0.0";
const port = 3001;
server.listen(port, ip, () => {
    console.log(`server running at http://${ip}:${port}`);
});
