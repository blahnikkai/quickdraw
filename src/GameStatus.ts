enum GameStatus {
    // entering nickname
    NICKNAME,
    // button to join a game, if game starts, they won't be playing
    WAITING,
    // ready to start game
    READY,
    // playing the game
    PLAYING,
}

export default GameStatus
