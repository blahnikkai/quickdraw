enum GameStatus {
    // entering nickname
    NICKNAME,
    // button to join a game, if game starts, they'll be spectating
    WAITING,
    // spectating
    SPECTATING,
    // ready to start game
    READY,
    // playing the game
    PLAYING,
}

export default GameStatus
