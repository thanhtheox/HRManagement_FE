import React from "react";

function ReportFlagIcon({
    width,
    height,
    fill,
    stroke,
}: {
    width: string;
    height: string;
    fill: string;
    stroke: string;
}) {
    return (
        <svg 
            width={width}
            height={height} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg">
            <path 
                d="M4 15C4 15 5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V3C20 3 19 4 16 4C13 4 11 2 8 2C5 2 4 3 4 3L4 22" 
                stroke={stroke}
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"/>
        </svg>
    );
}

export default ReportFlagIcon;

