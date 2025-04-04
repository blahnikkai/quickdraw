import { useState } from "react";
import "./Nickname.css";

export default function Nickname({
    submitName,
}: {
    submitName: (name: string) => void;
}) {
    const [name, setName] = useState("");
    return (
        <form
            className="game-ui"
            onSubmit={(event) => {
                event.preventDefault();
                submitName(name);
            }}
        >
            <label className="nickname">
                Enter a nickname:
                <input
                    className="nickname"
                    onChange={(event) => setName(event.target.value)}
                    defaultValue={name}
                />
            </label>
            <button>Join Game</button>
        </form>
    );
}
