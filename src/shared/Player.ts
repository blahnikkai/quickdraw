import GameStatus from "./GameStatus.js";
import GuessStatus from "./GuessStatus.js";

export default class Player {
    socketId: string;
    host: boolean;
    name: string;
    partialGuess: string;
    lastGuess: string;
    lastGuessStatus: GuessStatus | undefined;
    lastGuessRarity: number;
    dying: boolean;
    dead: boolean;
    gameStatus: GameStatus;
    lives: number;

    constructor(socketId: string) {
        this.socketId = socketId;
        this.host = false;
        this.name = "Player";
        this.partialGuess = "";
        this.lastGuess = "";
        this.lastGuessStatus = undefined;
        this.lastGuessRarity = 10;
        this.dying = false;
        this.dead = false;
        this.gameStatus = GameStatus.NICKNAME;
        this.lives = 100;
    }

    get aliveAndPlaying() {
        return !this.dead && this.gameStatus == GameStatus.PLAYING;
    }

    reset() {
        this.lives = 1337;
        this.dead = false;
        this.partialGuess = "";
        this.lastGuess = "";
        this.lastGuessStatus = undefined;
        this.lastGuessRarity = 10;
        this.dying = false;
        if (this.gameStatus === GameStatus.SPECTATING_PLAYING || this.gameStatus === GameStatus.SPECTATING_WAITING) {
            this.gameStatus = GameStatus.SPECTATING_WAITING;
        }
        else if (this.gameStatus !== GameStatus.NICKNAME) {
            this.gameStatus = GameStatus.WAITING;
        }
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
        this.partialGuess = "";
        this.lastGuessStatus = undefined;
        this.lastGuessRarity = 10;
        this.dying = false;
    }

    checkDying() {
        this.dying = this.aliveAndPlaying && this.lastGuessStatus !== GuessStatus.VALID;
    }

    setName(newName: string) {
        this.name = newName;
    }
}
