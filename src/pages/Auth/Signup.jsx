// src/pages/Auth/Signup.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// 👇 Import the new Background components
import LiquidBackgroundDeep from "../../components/LiquidBackgroundDeep";
import Snowfall from "../../components/Snowfall";

import { COUNTRIES } from "../../data/countries";

const Signup = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // 👇 2. Updated initial state (Empty defaults)
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

    const proInput = "w-full px-4 py-3.5 rounded-xl bg-slate-50/50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all font-medium shadow-sm";
    const labelStyle = "block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1 tracking-wider";

    if (status === "success") {
        // ... (Keep your existing success view code here, it's perfect) ...
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans py-10">
            <LiquidBackgroundDeep />
            <Snowfall />

            <div className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,180,216,0.5)] border border-white/60 mx-4">
                {/* ... (Header code remains the same) ... */}
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                    
                    {/* ... (Personal Details section remains the same) ... */}

                    {/* Address Header */}
                    <div className="col-span-1 md:col-span-2 pb-2 border-b border-slate-200 mt-4 mb-2">
                        <h3 className="text-xs font-black text-cyan-600 uppercase tracking-widest">Address</h3>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2">
                        <label className={labelStyle}>Street Address</label>
                        <input name="street" placeholder="Street Address" onChange={handleAddressChange} required className={proInput} />
                    </div>
                    
                    {/* 👇 3. Country is now a Dropdown */}
                    <div>
                        <label className={labelStyle}>Country</label>
                        <select name="country" onChange={handleAddressChange} required className={proInput} defaultValue="">
                            <option value="" disabled>Select Country</option>
                            {COUNTRIES.map((country) => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>

                    {/* 👇 4. State is now a Manual Input */}
                    <div>
                        <label className={labelStyle}>State / Province</label>
                        <input 
                            name="state" 
                            placeholder="State or Province" 
                            onChange={handleAddressChange} 
                            required 
                            className={proInput} 
                        />
                    </div>
                    
                    <div>
                        <label className={labelStyle}>City</label>
                        <input name="city" placeholder="City" onChange={handleAddressChange} required className={proInput} />
                    </div>

                    <div>
                        <label className={labelStyle}>Zip Code</label>
                        <input name="zipCode" placeholder="Zip Code" onChange={handleAddressChange} required className={proInput} />
                    </div>

                    {/* ... (Submit button section remains the same) ... */}

                </form>
            </div>
        </div>
    );
};

export default Signup;