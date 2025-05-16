enum GameStatus {
    // entering nickname
    NICKNAME = "Nickname",
    // button to join a game, if game starts, they'll be spectating
    WAITING = "Waiting",
    // spectating
    SPECTATING = "Spectating",
    // ready to start game
    READY = "Ready",
    // playing the game
    PLAYING = "Playing",
}

export default GameStatus
