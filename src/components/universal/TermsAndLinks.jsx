export const TermsAndLinks = ({ containerStyle = "" }) => {
    return (
        <p className={`${containerStyle} whitespace-pre-wrap text-xs text-slate-500`}>
            <span className="cursor-pointer hover:underline">
                Privacy
            </span>{" "}
            ·{" "}
            <span className="cursor-pointer hover:underline">
                Terms
            </span>{" "}
            ·{" "}
            <span className="cursor-pointer hover:underline">
                Advertising
            </span>{" "}
            ·{" "}
            <span className="cursor-pointer hover:underline">
                Ad choices
            </span>{" "}
            ·{" "}
            <span className="cursor-pointer hover:underline">
                Cookies
            </span>{" "}
            ·{" "}
            <span className="cursor-pointer hover:underline">
                More
            </span>{" "}
            · <span>Meta © 2023</span>
        </p>
    )
}
