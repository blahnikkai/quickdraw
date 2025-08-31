import { FaHouse } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function HomeButton() {
    const navigate = useNavigate();
    return (
        <button
            className="nav-btn"
            onClick={() => {
                navigate("/");
            }}
        >
            <FaHouse className="nav-icon"/>
            Home
        </button>
    );
}
