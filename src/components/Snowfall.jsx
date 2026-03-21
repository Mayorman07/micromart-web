// src/components/Snowfall.jsx
import { useMemo } from "react";

const Snowfall = () => {
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
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
            {snowflakes.map((flake) => (
                <div 
                    key={flake.id}
                    className="absolute top-[-20px] bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)] animate-snowfall"
                    style={{
                        left: `${flake.left}vw`,
                        width: `${flake.size}px`,
                        height: `${flake.size}px`,
                        opacity: flake.opacity,
                        animationDuration: `${flake.duration}s`,
                        animationDelay: `-${flake.delay}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default Snowfall;