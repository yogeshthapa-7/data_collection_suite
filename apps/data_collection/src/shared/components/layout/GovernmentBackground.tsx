import React from "react"
 
const GovernmentBackground: React.FC = () => {
return (
<div
aria-hidden="true"
className="fixed inset-0 -z-10 h-screen w-full overflow-hidden pointer-events-none"
>
{/* Main Government Gradient */}
<div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-[#EAF3FB] to-[#DCEBFA]" />
 
{/* Subtle SVG Geometric Pattern */}
<svg
className="absolute inset-0 h-full w-full"
xmlns="http://www.w3.org/2000/svg"
preserveAspectRatio="xMidYMid slice"
>
<defs>
<linearGradient id="govBlue" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stopColor="#003893" stopOpacity="0.08" />
<stop offset="100%" stopColor="#0D5CB6" stopOpacity="0.04" />
</linearGradient>
 
<linearGradient id="govLight" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stopColor="#1E6BA8" stopOpacity="0.06" />
<stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
</linearGradient>
</defs>
 
{/* Top Left */}
<path
d="M0 0 L500 0 L380 320 L0 220 Z"
fill="url(#govBlue)"
/>
 
<path
d="M0 250 L360 180 L280 520 L0 480 Z"
fill="url(#govLight)"
/>
 
{/* Bottom Left */}
<path
d="M0 1080 L0 820 L320 920 L180 1080 Z"
fill="url(#govBlue)"
/>
 
{/* Top Right */}
<path
d="M1920 0 L1420 0 L1540 320 L1920 240 Z"
fill="url(#govBlue)"
/>
 
<path
d="M1920 300 L1600 220 L1680 560 L1920 500 Z"
fill="url(#govLight)"
/>
 
{/* Bottom Right */}
<path
d="M1920 1080 L1920 780 L1600 900 L1740 1080 Z"
fill="url(#govBlue)"
/>
</svg>
 
{/* Nepal Flag Inspired Accent */}
<div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#003893] via-[#0D5CB6] to-[#DC143C]" />
 
{/* Soft Blue Glow */}
<div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#0D5CB6]/10 blur-[120px]" />
 
<div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#003893]/10 blur-[120px]" />
 
{/* Very Subtle Red Accent */}
<div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#DC143C]/5 blur-[140px]" />
 
{/* Center Reading Area */}
<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_0%,rgba(255,255,255,0)_55%,rgba(248,250,252,0.35)_100%)]" />
</div>
)
}
 
export default GovernmentBackground