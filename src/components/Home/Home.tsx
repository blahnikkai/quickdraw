import io from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const [joinGid, setJoinGid] = useState(null);

    useEffect(() => {
        let options = {};
        if(import.meta.env.VITE_PATH_OPTION !== "") {
            options = {path: import.meta.env.VITE_PATH_OPTION};
        }
        socketRef.current = io(import.meta.env.VITE_BACKEND_URL, options);

        socketRef.current.on("game created", (gid: string) => {
            navigate(`/game/${gid}`);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    return (
        <main className="home">
            <div className="home-section">
                <button
                    onClick={() => {
                        socketRef.current.emit("create game");
                    }}
                >
                    Create a Game
                </button>
            </div>
            - or -
            <div className="home-section">
                <form
                    className="join-game-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        navigate(`/game/${joinGid}`);
                    }}
                >
                    <input
                        onChange={(e) => {
                            e.preventDefault();
                            setJoinGid(e.target.value);
                        }}
                    ></input>
                    <button>Join Game</button>
                </form>
            </div>
        </main>
    );
}
