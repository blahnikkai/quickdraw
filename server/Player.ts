import GameStatus from "../src/GameStatus";
import GuessStatus from "../src/GuessStatus";

export default class Player {
    socketId: string;
    name: string;
    lives: number;
    lastGuess: string;
    lastGuessStatus: GuessStatus;
    dying: boolean;
    dead: boolean;
    gameStatus: GameStatus;

    constructor(socketId: string) {
        this.socketId = socketId;
        this.name = "Player";
        this.lastGuess = "";
        this.lastGuessStatus = undefined;
        this.lives = 2;
        this.dying = false;
        this.dead = false;
        this.gameStatus = GameStatus.NICKNAME;
    }

    reset() {
        this.lives = 2;
        this.dead = false;
        this.gameStatus = GameStatus.WAITING;
    }

    setGameStatus(newGameStatus: GameStatus) {
        this.gameStatus = newGameStatus;
    }

    startRound(): boolean {
        if (this.dead) {
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
        return !this.dead;
    }

    checkDying() {
        this.dying = !this.dead && this.lastGuessStatus !== GuessStatus.VALID;
    }

    enterName(newName: string) {
        this.name = newName;
    }
}
