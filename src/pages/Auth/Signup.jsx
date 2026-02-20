import { useState } from "react";
import api from "../../services/api"; 
import { useNavigate } from "react-router-dom";
import LiquidBackgroundDeep from "../../components/LiquidBackgroundDeep";
import Snowfall from "../../components/Snowfall";
import { COUNTRIES } from "../../data/countries"; 

/**
 * Signup Component
 * Facilitates new user registration with profile and address details.
 * Communicates with the Spring Boot /users/create endpoint via the centralized API service.
 */
const Signup = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");
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
            state: "",
            country: "",
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

    /**
     * Dispatches the registration payload to the backend.
     * On success, prompts the user to verify their email as per the security flow.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            /** * Utilizing the api instance ensures consistent baseURL and 
             * global interceptor configurations are applied 
             */
            await api.post("/users/users/create", formData);
            setStatus("success");
        } catch (error) {
            console.error("Registration Error:", error);
            setStatus("error");
            // Extracting standardized error message from the response
            setErrorMessage(error.response?.data?.message || "Registration failed. Please check your details.");
        }
    };

    const inputStyle = "w-full px-4 py-3.5 rounded-xl bg-slate-50/50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all font-medium shadow-sm";
    const labelStyle = "block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest";

    if (status === "success") {
        return (
            <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans">
                <LiquidBackgroundDeep />
                <Snowfall />

                <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,180,216,0.3)] border border-white/60 text-center mx-4">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Check your Inbox</h2>
                    <p className="text-slate-500 mb-8 font-medium leading-relaxed">
                        A verification link has been sent to: <br/>
                        <span className="font-bold text-slate-800">{formData.email}</span>
                    </p>
                    
                    <button 
                        onClick={() => navigate("/login")} 
                        className="w-full py-4 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-700 shadow-xl shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans py-12">
            <LiquidBackgroundDeep />
            <Snowfall />

            <div className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,180,216,0.3)] border border-white/60 mx-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight uppercase">Create Account</h2>
                    <p className="text-slate-500 font-medium">Let the journey begin</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 text-left">
                    <div className="col-span-1 md:col-span-2 pb-2 border-b border-slate-100 mb-2">
                        <h3 className="text-[11px] font-black text-cyan-600 uppercase tracking-[0.2em]">Profile Information</h3>
                    </div>
                    
                    <div>
                        <label className={labelStyle}>First Name</label>
                        <input name="firstName" placeholder="John" onChange={handleChange} required className={inputStyle} />
                    </div>
                    <div>
                        <label className={labelStyle}>Last Name</label>
                        <input name="lastName" placeholder="Doe" onChange={handleChange} required className={inputStyle} />
                    </div>
                    
                    <div>
                        <label className={labelStyle}>Email Address</label>
                        <input name="email" type="email" placeholder="john.doe@company.com" onChange={handleChange} required className={inputStyle} />
                    </div>
                    <div>
                        <label className={labelStyle}>Mobile Number</label>
                        <input name="mobileNumber" placeholder="+1 (555) 000-0000" onChange={handleChange} required className={inputStyle} />
                    </div>

                    <div>
                        <label className={labelStyle}>Gender</label>
                        <select name="gender" onChange={handleChange} className={inputStyle}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>

                    <div className="relative">
                        <label className={labelStyle}>Password</label>
                        <input 
                            name="password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            onChange={handleChange} 
                            required 
                            className={`${inputStyle} pr-12`} 
                        />
                        <button 
                            type="button"
                            onClick={togglePassword}
                            className="absolute right-4 top-10 text-slate-400 hover:text-cyan-600 transition-colors font-bold text-[10px] uppercase tracking-tighter"
                        >
                            {showPassword ? "Hide" : "Show"} 
                        </button>
                    </div>

                    <div className="col-span-1 md:col-span-2 pb-2 border-b border-slate-100 mt-6 mb-2">
                        <h3 className="text-[11px] font-black text-cyan-600 uppercase tracking-[0.2em]">Primary Address</h3>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2">
                        <label className={labelStyle}>Street Address</label>
                        <input name="street" placeholder="123 Business Way" onChange={handleAddressChange} required className={inputStyle} />
                    </div>
                    
                    <div>
                        <label className={labelStyle}>Country</label>
                        <select name="country" onChange={handleAddressChange} required className={inputStyle} defaultValue="">
                            <option value="" disabled>Select Country</option>
                            {COUNTRIES.map((country) => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={labelStyle}>State / Province</label>
                        <input name="state" placeholder="State" onChange={handleAddressChange} required className={inputStyle} />
                    </div>
                    
                    <div>
                        <label className={labelStyle}>City</label>
                        <input name="city" placeholder="City" onChange={handleAddressChange} required className={inputStyle} />
                    </div>
                    
                    <div>
                        <label className={labelStyle}>Zip Code</label>
                        <input name="zipCode" placeholder="000000" onChange={handleAddressChange} required className={inputStyle} />
                    </div>

                    <div className="col-span-1 md:col-span-2 mt-6">
                        {status === "error" && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold text-center uppercase tracking-widest">
                                {errorMessage}
                            </div>
                        )}
                        <button 
                            type="submit" 
                            disabled={status === "loading"}
                            className="w-full py-4 rounded-xl font-black text-white text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600"
                        >
                            {status === "loading" ? "Processing..." : "Create Account"}
                        </button>
                    </div>

                    <div className="col-span-1 md:col-span-2 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">
                        Already registered?{" "}
                        <button onClick={() => navigate("/login")} className="text-cyan-600 hover:text-cyan-800 ml-1 transition-colors">
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;