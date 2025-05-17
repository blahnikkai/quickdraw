import { useState } from "react";
import "./CopyLinkButton.css";

export default function CopyLinkButton() {
    const [btnText, setBtnText] = useState("Copy Game Link");
    return (
        <button
            className="copy-link-btn"
            onClick={() => {
                const url = window.location.href;
                navigator.clipboard.writeText(url);
                setBtnText("Copied✅");
                setTimeout(() => setBtnText("Copy Game Link"), 750);
            }}
        >
            {btnText}
        </button>
    );
}
