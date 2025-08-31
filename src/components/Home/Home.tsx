import io from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const [joinGid, setJoinGid] = useState(null);

    useEffect(() => {
        socketRef.current = io("https://3.90.125.101");
        socketRef.current.on("game created", (gid) => {
            navigate(`/game/${gid}`);
        });
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    return (
        <main className="home">
            <div className="home-section">
                Create a new game
                <button
                    onClick={() => {
                        socketRef.current.emit("create game");
                    }}
                >
                    Play
                </button>
            </div>
            - or -
            <div className="home-section">
                Join an existing game
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
                    <button>Join</button>
                </form>
            </div>
        </main>
    );
}
