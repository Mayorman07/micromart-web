// src/pages/Auth/Signup.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// 👇 Import the new Background components
import LiquidBackgroundDeep from "../../components/LiquidBackgroundDeep";
import Snowfall from "../../components/Snowfall";

// 🇳🇬 State List
const NIGERIAN_STATES = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", 
    "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", 
    "Taraba", "Yobe", "Zamfara"
];

const Signup = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");
    
    // 👁️ Password Visibility
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        gender: "Male",
        mobileNumber: "",
        address: {
            street: "",
            city: "",
            state: "Lagos",
            country: "Nigeria",
            zipCode: ""
        }
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddressChange = (e) => {
        setFormData({
            ...formData,
            address: {
                ...formData.address,
                [e.target.name]: e.target.value
            }
        });
    };

    const togglePassword = () => {
        setShowPassword(true);
        setTimeout(() => setShowPassword(false), 2000); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            await axios.post("http://127.0.0.1:7082/users/users/create", formData);
            setStatus("success");
        } catch (error) {
            console.error("Signup Failed", error);
            setStatus("error");
            setErrorMessage("Registration failed. Please try again.");
        }
    };

    // ✨ The "Frosted Porcelain" Input Style (Matches Login)
    const proInput = "w-full px-4 py-3.5 rounded-xl bg-slate-50/50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all font-medium shadow-sm";
    
    // Label Style for consistency
    const labelStyle = "block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1 tracking-wider";

    // ✅ Success View (Styled to match theme)
    if (status === "success") {
        return (
            <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans">
                <LiquidBackgroundDeep />
                <Snowfall />

                <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,180,216,0.5)] border border-white/60 text-center mx-4">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-green-100">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Check your Inbox!</h2>
                    <p className="text-slate-500 mb-8 font-medium">
                        We have sent a verification link to <br/>
                        <span className="font-bold text-slate-800">{formData.email}</span>
                    </p>
                    
                    <button 
                        onClick={() => navigate("/login")} 
                        className="w-full py-4 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:to-blue-700 shadow-xl shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
                    >
                        Proceed to Login
                    </button>
                </div>
            </div>
        );
    }

    // 📝 Signup Form View
    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans py-10">
            {/* Background Layers */}
            <LiquidBackgroundDeep />
            <Snowfall />

            {/* Card Container - Wider for Signup */}
            <div className="relative z-10 w-full max-w-2xl 
                bg-white/95 
                backdrop-blur-xl 
                p-8 md:p-10
                rounded-3xl 
                shadow-[0_20px_60px_-15px_rgba(0,180,216,0.5)] 
                border border-white/60 
                mx-4"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Create Account</h2>
                    <p className="text-slate-500 font-medium">Join MicroMart today.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                    
                    {/* Personal Details Header */}
                    <div className="col-span-1 md:col-span-2 pb-2 border-b border-slate-200 mb-2">
                        <h3 className="text-xs font-black text-cyan-600 uppercase tracking-widest">Personal Details</h3>
                    </div>
                    
                    <div>
                        <label className={labelStyle}>First Name</label>
                        <input name="firstName" placeholder="First Name" onChange={handleChange} required className={proInput} />
                    </div>
                    <div>
                        <label className={labelStyle}>Last Name</label>
                        <input name="lastName" placeholder="Last Name" onChange={handleChange} required className={proInput} />
                    </div>
                    
                    <div>
                        <label className={labelStyle}>Email</label>
                        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className={proInput} />
                    </div>
                    <div>
                        <label className={labelStyle}>Mobile Number</label>
                        <input name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} required className={proInput} />
                    </div>

                    <div>
                        <label className={labelStyle}>Gender</label>
                        <select name="gender" onChange={handleChange} className={proInput}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non binary">Non binary</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>

                    {/* Password with Eye Icon */}
                    <div className="relative">
                        <label className={labelStyle}>Password</label>
                        <input 
                            name="password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            onChange={handleChange} 
                            required 
                            className={`${proInput} pr-10`} 
                        />
                        <button 
                            type="button"
                            onClick={togglePassword}
                            className="absolute right-3 top-[34px] text-slate-400 hover:text-cyan-600 transition-colors p-1"
                        >
                            {showPassword ? "🙈" : "👁️"} 
                        </button>
                    </div>

                    {/* Address Header */}
                    <div className="col-span-1 md:col-span-2 pb-2 border-b border-slate-200 mt-4 mb-2">
                        <h3 className="text-xs font-black text-cyan-600 uppercase tracking-widest">Address</h3>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2">
                        <label className={labelStyle}>Street Address</label>
                        <input name="street" placeholder="Street Address" onChange={handleAddressChange} required className={proInput} />
                    </div>
                    
                    <div>
                        <label className={labelStyle}>City</label>
                        <input name="city" placeholder="City" onChange={handleAddressChange} required className={proInput} />
                    </div>
                    
                    <div>
                        <label className={labelStyle}>State</label>
                        <select name="state" onChange={handleAddressChange} required className={proInput} defaultValue="Lagos">
                            <option value="" disabled>Select State</option>
                            {NIGERIAN_STATES.map((state) => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className={labelStyle}>Country</label>
                        <input name="country" placeholder="Country" onChange={handleAddressChange} required className={`${proInput} bg-slate-100 text-slate-500 cursor-not-allowed`} value="Nigeria" disabled />
                    </div>
                    <div>
                        <label className={labelStyle}>Zip Code</label>
                        <input name="zipCode" placeholder="Zip Code" onChange={handleAddressChange} required className={proInput} />
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-1 md:col-span-2 mt-4">
                        {status === "error" && (
                            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
                                ⚠️ {errorMessage}
                            </div>
                        )}
                        <button 
                            type="submit" 
                            disabled={status === "loading"}
                            className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-xl shadow-cyan-500/20 transition-all duration-200 transform hover:-translate-y-0.5
                                ${status === 'loading' 
                                    ? 'bg-slate-300 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:to-blue-700'
                                }
                            `}
                        >
                            {status === "loading" ? "Creating Account..." : "Sign Up"}
                        </button>
                    </div>

                    <div className="col-span-1 md:col-span-2 text-center text-sm text-slate-500 font-medium">
                        Already have an account?{" "}
                        <span onClick={() => navigate("/login")} className="text-cyan-600 font-bold cursor-pointer hover:underline hover:text-cyan-800 transition-colors">
                            Login
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;