import { useNavigate } from "react-router-dom";

export default function HomeButton() {
    const navigate = useNavigate();
    return (
        <button
            className="copy-link-btn"
            onClick={() => {
                navigate("/");
            }}
        >
            Home
        </button>
    );
}
