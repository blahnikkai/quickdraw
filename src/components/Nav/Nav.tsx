import Difficulty from "../../shared/Difficulty.js";
import GameStatus from "../../shared/GameStatus.js";
import CopyLinkButton from "../CopyLinkButton/CopyLinkButton.js";
import HomeButton from "../HomeButton/HomeButton.js";
import Settings from "../Settings/Settings.js";
import ShowSettingsButton from "../ShowSettingsButton/ShowSettingsButton.js";

export default function Nav({
    gameStatus,
    showingSettings,
    setShowingSettings,
    difficulty,
    setDifficulty,
    roundTime,
    setRoundTime,
    startingLives,
    setStartingLives,
    updateSettings,
    viewOnly,
} : {
    gameStatus: GameStatus;
    showingSettings: boolean;
    setShowingSettings: (newShowingSettings: boolean) => void;
    difficulty: Difficulty;
    setDifficulty: (newDifficulty: Difficulty) => void;
    roundTime: number;
    setRoundTime: (newRoundTime: number) => void;
    startingLives: number;
    setStartingLives: (newStartingLives: number) => void;
    updateSettings: (
        difficulty: Difficulty,
        roundTime: number,
        startingLives: number
    ) => void;
    viewOnly: boolean;
}) {
    return (
        <nav>
            <HomeButton />
            <CopyLinkButton />
            <div className="settings-container">
                {[GameStatus.WAITING, GameStatus.READY].includes(
                    gameStatus
                ) && (
                        <ShowSettingsButton
                            showingSettings={showingSettings}
                            setShowingSettings={setShowingSettings}
                        />
                    )}
                {[GameStatus.WAITING, GameStatus.READY].includes(
                    gameStatus
                ) &&
                    showingSettings && (
                        <Settings
                            difficulty={difficulty}
                            setDifficulty={setDifficulty}
                            roundTime={roundTime}
                            setRoundTime={setRoundTime}
                            startingLives={startingLives}
                            setStartingLives={setStartingLives}
                            updateSettings={updateSettings}
                            viewOnly={viewOnly}
                        />
                    )}
            </div>
        </nav>
    );
}
