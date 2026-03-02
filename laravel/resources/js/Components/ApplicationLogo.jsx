export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
        >
            {/* Shopping bag body */}
            <rect x="20" y="45" width="80" height="60" rx="6" fill="#111827" />
            {/* Bag handle */}
            <path
                d="M42 45 C42 28 78 28 78 45"
                stroke="#111827"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
            />
            {/* GS monogram */}
            <text
                x="60"
                y="88"
                textAnchor="middle"
                fontFamily="system-ui, sans-serif"
                fontWeight="bold"
                fontSize="30"
                fill="white"
                letterSpacing="-1"
            >GS</text>
        </svg>
    );
}
