import { FaGear } from "react-icons/fa6";

export default function ShowSettingsButton({
    showingSettings,
    setShowingSettings,
}: {
    showingSettings: boolean;
    setShowingSettings: (newShowingSettings: boolean) => void;
}) {
    return (
        <button
            className="nav-btn"
            onClick={() => {
                setShowingSettings(!showingSettings);
            }}
            style={{
                backgroundColor: showingSettings
                    ? "var(--clr-1)"
                    : "var(--clr-3)",
            }}
        >
            <FaGear className="nav-icon"/>
            {showingSettings ? " Hide Settings" : " Show Settings"}
        </button>
    );
}
