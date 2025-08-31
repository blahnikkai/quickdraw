import { FaLink } from "react-icons/fa6";
import { useState } from "react";
import "./CopyLinkButton.css";

export default function CopyLinkButton() {
    const [btnText, setBtnText] = useState("Copy Game Link");
    const [copiedMsgTimeout, setCopiedMsgTimeout] = useState(null);
    return (
        <button
            className="nav-btn"
            onClick={() => {
                const url = window.location.href;
                navigator.clipboard.writeText(url);
                setBtnText("✅ Copied");
                clearTimeout(copiedMsgTimeout);
                setCopiedMsgTimeout(
                    setTimeout(() => setBtnText("Copy Game Link"), 750)
                );
            }}
        >
            <FaLink className="nav-icon" />
            {btnText}
        </button>
    );
}
