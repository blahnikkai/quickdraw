import GameStatus from "../src/GameStatus";
import GuessStatus from "../src/GuessStatus";
import { DEFAULT_STARTING_LIVES } from "../src/constants";

export default class Player {
    socketId: string;
    host: boolean;
    name: string;
    lastGuess: string;
    lastGuessStatus: GuessStatus;
    dying: boolean;
    dead: boolean;
    gameStatus: GameStatus;
    lives: number;

    constructor(socketId: string) {
        this.socketId = socketId;
        this.host = false;
        this.name = "Player";
        this.lastGuess = "";
        this.lastGuessStatus = undefined;
        this.dying = false;
        this.dead = false;
        this.gameStatus = GameStatus.NICKNAME;
        this.lives = 100;
    }

    get aliveAndPlaying() {
        return !this.dead && this.gameStatus == GameStatus.PLAYING;
    }

    reset() {
        this.lives = 100;
        this.dead = false;
        this.gameStatus = GameStatus.WAITING;
    }

    setGameStatus(newGameStatus: GameStatus) {
        this.gameStatus = newGameStatus;
    }

    startRound() {
        if (!this.aliveAndPlaying) {
            return;
        }
        if (this.lastGuessStatus !== GuessStatus.VALID) {
            this.lives--;
            if (this.lives === 0) {
                this.dead = true;
            }
        }
        this.lastGuess = "";
        this.lastGuessStatus = undefined;
        this.dying = false;
    }

    checkDying() {
        this.dying = this.aliveAndPlaying && this.lastGuessStatus !== GuessStatus.VALID;
    }

    setName(newName: string) {
        this.name = newName;
    }
}
