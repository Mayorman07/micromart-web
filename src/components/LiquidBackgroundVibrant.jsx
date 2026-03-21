const LiquidBackgroundVibrant = () => {
    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden bg-blue-500 z-0">
            {/* 1. The Base Premium Gradient (Your favorite) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00f2fe] to-[#4facfe]"></div>

            {/* 2. The Liquid Currents (Subtle & Professional) */}
            {/* A deep current to add depth */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-700 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob"></div>
            
            {/* A bright highlight current for 'shimmer' */}
            <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-white rounded-full mix-blend-overlay filter blur-[60px] opacity-30 animate-blob animation-delay-2000"></div>
            
            {/* A cyan flow at the bottom */}
            <div className="absolute -bottom-32 left-[20%] w-[600px] h-[600px] bg-cyan-300 rounded-full mix-blend-soft-light filter blur-[80px] opacity-40 animate-blob animation-delay-4000"></div>
            
            {/* 3. Noise Texture (Tiny bit of grain for realism) */}
            <div className="absolute inset-0 bg-white/5 opacity-[0.03]"></div>
        </div>
    );
};

export default LiquidBackgroundVibrant;