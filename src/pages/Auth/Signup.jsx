// src/pages/Auth/Signup.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Snowfall from "../../components/Snowfall"; 

// 🇳🇬 State List
const NIGERIAN_STATES = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", 
    "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", 
    "Taraba", "Yobe", "Zamfara"
];

// 🎨 Reusable Input Style (Glass Effect)
const inputClass = "w-full px-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-700 placeholder-slate-400";

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

    // ✅ Success View
    if (status === "success") {
        return (
            // Using your EXACT original gradient colors here
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#00f2fe] to-[#4facfe] relative overflow-hidden font-sans">
                <Snowfall />

                <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/50 text-center mx-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Check your Inbox!</h2>
                    <p className="text-slate-500 mb-6">
                        We have sent a verification link to <br/>
                        <span className="font-semibold text-slate-800">{formData.email}</span>
                    </p>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-6 text-sm text-green-700">
                        💡 Click the link in that email to activate your account.
                    </div>
                    <button onClick={() => navigate("/login")} className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 transition-all">
                        Proceed to Login Page
                    </button>
                </div>
            </div>
        );
    }

    // 📝 Signup Form View
    return (
        // Using your EXACT original gradient colors here
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#00f2fe] to-[#4facfe] relative overflow-hidden font-sans py-10">
            <Snowfall />

            <div className="relative z-10 w-full max-w-2xl bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/50 text-center mx-4">
                
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h2>
                <p className="text-slate-500 mb-8">Join Micromart today.</p>

                {/* Grid Layout: 1 column on mobile, 2 on desktop */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    
                    {/* Personal Details Header */}
                    <div className="col-span-1 md:col-span-2 pb-1 border-b border-slate-200 mb-2">
                        <h3 className="text-sm uppercase tracking-wider text-slate-500 font-bold">Personal Details</h3>
                    </div>
                    
                    <input name="firstName" placeholder="First Name" onChange={handleChange} required className={inputClass} />
                    <input name="lastName" placeholder="Last Name" onChange={handleChange} required className={inputClass} />
                    
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} required className={inputClass} />
                    <input name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} required className={inputClass} />

                    <select name="gender" onChange={handleChange} className={inputClass}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non binary">Non binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                    </select>

                    {/* Password with Eye Icon */}
                    <div className="relative">
                        <input 
                            name="password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            onChange={handleChange} 
                            required 
                            className={`${inputClass} pr-10`} 
                        />
                        <button 
                            type="button"
                            onClick={togglePassword}
                            className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showPassword ? "🙈" : "👁️"} 
                        </button>
                    </div>

                    {/* Address Header */}
                    <div className="col-span-1 md:col-span-2 pb-1 border-b border-slate-200 mt-4 mb-2">
                        <h3 className="text-sm uppercase tracking-wider text-slate-500 font-bold">Address</h3>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2">
                        <input name="street" placeholder="Street Address" onChange={handleAddressChange} required className={inputClass} />
                    </div>
                    
                    <input name="city" placeholder="City" onChange={handleAddressChange} required className={inputClass} />
                    
                    <select name="state" onChange={handleAddressChange} required className={inputClass} defaultValue="Lagos">
                        <option value="" disabled>Select State</option>
                        {NIGERIAN_STATES.map((state) => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                    
                    <input name="country" placeholder="Country" onChange={handleAddressChange} required className={inputClass} value="Nigeria" />
                    <input name="zipCode" placeholder="Zip Code" onChange={handleAddressChange} required className={inputClass} />

                    {/* Submit Button */}
                    <div className="col-span-1 md:col-span-2 mt-6">
                        {status === "error" && (
                            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
                                ⚠️ {errorMessage}
                            </div>
                        )}
                        <button 
                            type="submit" 
                            disabled={status === "loading"}
                            className="w-full py-3.5 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === "loading" ? "Creating Account..." : "Sign Up"}
                        </button>
                    </div>

                    <div className="col-span-1 md:col-span-2 text-center text-sm text-slate-500 mt-2">
                        Already have an account?{" "}
                        <span onClick={() => navigate("/login")} className="text-blue-600 font-bold cursor-pointer hover:underline underline-offset-2">
                            Login
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;