import { Socket } from "socket.io-client";
import "./Playing.css";
import Player from "../../../server/Player";

export default function Playing({
  selfPlayerInfo,
  guess,
  setGuess,
  phrase,
  playingRound,
  timeProgress,
  submitGuess,
}: {
  selfPlayerInfo: Player;
  guess: string;
  setGuess: CallableFunction;
  phrase: string;
  playingRound: boolean;
  timeProgress: number;
  submitGuess: () => void;
}) {
  return (
    <div className="game-ui ingame">
      <div>{phrase}</div>
      <div>Lives: {selfPlayerInfo?.lives}</div>
      <div className={"last-guess " + selfPlayerInfo?.lastGuessStatus}>
        {selfPlayerInfo?.lastGuess}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitGuess();
        }}
      >
        <input
          value={guess}
          onChange={(event) => setGuess(event.target.value)}
          disabled={!playingRound}
        />
      </form>
      <div
        className="timer-bar"
        style={{ width: `${100 * (1 - timeProgress)}%` }}
      ></div>
    </div>
  );
}
