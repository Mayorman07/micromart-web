// src/components/LiquidBackgroundDeep.jsx
const LiquidBackgroundDeep = () => {
    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden bg-blue-600 z-0">
            {/* 1. Base Gradient (Your Favorite) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00f2fe] to-[#4facfe]"></div>

            {/* 2. The Hybrid Blobs (Rich Color Variants) */}
            
            {/* PURPLE DEPTH: Adds that rich variant you missed. 
                Using 'multiply' to make it darker/deeper than the background. */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
            
            {/* CYAN SHIMMER: Adds the bright "water" highlight. */}
            <div className="absolute top-[20%] right-[-20%] w-[500px] h-[500px] bg-cyan-300 rounded-full mix-blend-overlay filter blur-[80px] opacity-60 animate-blob animation-delay-2000"></div>
            
            {/* INDIGO FLOW: Connects the two for complexity. */}
            <div className="absolute -bottom-32 left-[20%] w-[600px] h-[600px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-[90px] opacity-30 animate-blob animation-delay-4000"></div>
            
            {/* 3. Texture */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[0px]"></div>
        </div>
    );
};

export default LiquidBackgroundDeep;