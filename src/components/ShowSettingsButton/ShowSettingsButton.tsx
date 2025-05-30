import { FaGear } from "react-icons/fa6";
import "./ShowSettingsButton.css";

export default function ShowSettingsButton({
    showingSettings,
    setShowingSettings,
}: {
    showingSettings: boolean;
    setShowingSettings: (newShowingSettings: boolean) => void;
}) {
    return (
        <button
            className="show-settings-btn"
            onClick={() => {
                setShowingSettings(!showingSettings);
            }}
        >
            {showingSettings ? "Hide Settings": "Show Settings"}
            <FaGear/>
        </button>
    );
}
