import { useMemo } from "react";
import "../VerifyEmail.css"; // Ensure this has your .snowflake CSS

const Snowfall = () => {
    // ❄️ SNOWFLAKES Logic
    const snowflakes = useMemo(() => {
        return [...Array(50)].map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 5 + 5,
            delay: Math.random() * 5,
            opacity: Math.random() * 0.5 + 0.3
        }));
    }, []);

    return (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
            {snowflakes.map((flake) => (
                <div 
                    key={flake.id}
                    className="snowflake"
                    style={{
                        left: `${flake.left}vw`,
                        width: `${flake.size}px`,
                        height: `${flake.size}px`,
                        animation: `snowfall ${flake.duration}s linear infinite`,
                        animationDelay: `-${flake.delay}s`,
                        opacity: flake.opacity
                    }}
                />
            ))}
        </div>
    );
};

export default Snowfall;