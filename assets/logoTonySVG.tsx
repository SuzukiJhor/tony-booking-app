import React from "react";

type LogoTonySVGProps = React.SVGProps<SVGSVGElement>;

export function LogoTonySVG({ className, ...rest }: LogoTonySVGProps) {
    return (
        <svg
            {...rest}
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 140"
            role="img"
            aria-labelledby="title desc"
            preserveAspectRatio="xMidYMid meet"
        >
            <title id="title">Tony Agenda &amp; Confirmação</title>
            <desc id="desc">Logo corporativo com calendário e marca de verificação.</desc>

            <defs>
                <linearGradient id="corporate" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#005CBE" />
                    <stop offset="1" stopColor="#003F8C" />
                </linearGradient>
            </defs>

            <g transform="translate(24,22)">
                <rect x="0" y="12" width="86" height="86" rx="12" fill="white" stroke="url(#corporate)" strokeWidth="6" />
                <rect x="0" y="12" width="86" height="28" rx="12" fill="url(#corporate)" />
                <path d="M26 62 L39 75 L60 45" fill="none" stroke="#009B4A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <g transform="translate(140,55)" fill="currentColor">
                <text fontFamily="'Montserrat', sans-serif" fontSize="42" fontWeight="700">Tony</text>
                <text y="34" fontFamily="'Montserrat', sans-serif" fontSize="17" fontWeight="500">Agenda &amp; Confirmação</text>
            </g>
        </svg>
    );
}