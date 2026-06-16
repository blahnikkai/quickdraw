enum GameStatus {
    // entering nickname
    NICKNAME = "Nickname",
    // button to join a game, game can't start if someone is waiting
    WAITING = "Waiting",
    // spectating
    SPECTATING = "Spectating",
    // ready to start game
    READY = "Ready",
    // playing the game
    PLAYING = "Playing",
}

export default GameStatus
