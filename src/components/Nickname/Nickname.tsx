import { useState } from "react";
import "./Nickname.css";

export default function Nickname({
    submitName,
}: {
    submitName: (name: string) => void;
}) {
    const [name, setName] = useState("");
    const [invalidName, setInvalidName] = useState(false);
    return (
        <form
            className="game-ui"
            onSubmit={(event) => {
                event.preventDefault();
                if (name === "") {
                    setInvalidName(true);
                    return;
                }
                setInvalidName(false);
                submitName(name);
            }}
        >
            <label className="nickname">
                Enter a nickname:
                <input
                    autoFocus
                    className={"nickname" + (invalidName ? " invalid-name" : "")}
                    onChange={(event) => setName(event.target.value)}
                    defaultValue={name}
                />
            </label>
            <button>Join</button>
        </form>
    );
}
