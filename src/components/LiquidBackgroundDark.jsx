// src/components/LiquidBackground.jsx
const LiquidBackground = () => {
    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden bg-slate-900 z-0">
            {/* 1. Lighter Gradient so we can see depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 opacity-80"></div>

            {/* 2. GLOWING BLOBS (Fixed) */}
            {/* Changed 'mix-blend-multiply' to 'opacity-50' and brighter colors */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
            
            {/* 3. Noise Texture (Optional: Adds that 'film grain' look) */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"></div>
        </div>
    );
};

export default LiquidBackground;