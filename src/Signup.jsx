import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./VerifyEmail.css";

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

    if (status === "success") {
        return (
            <div className="verify-container">
                <div className="verify-card">
                    <div className="icon-circle">
                        {/* 📩 Envelope Icon */}
                        <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    
                    <h2 className="title">Check your Inbox!</h2>
                    
                    <p className="subtitle">
                        We have sent a verification link to <br/>
                        <strong>{formData.email}</strong>
                    </p>
                    
                    <div style={{ background: "rgba(255,255,255,0.5)", padding: "15px", borderRadius: "10px", margin: "20px 0", fontSize: "14px", color: "#555" }}>
                        💡 Click the link in that email to activate your account.
                    </div>

                    <button className="login-btn" onClick={() => navigate("/login")}>
                        Proceed to Login Page
                    </button>
                </div>
            </div>
        );
    }

    // ✨ RENDER FORM STATE
    return (
        <div className="verify-container" style={{overflowY: "auto"}}>
            <div className="verify-card" style={{ maxWidth: "600px", marginTop: "50px", marginBottom: "50px" }}>
                
                <h2 className="title">🚀 Create Account</h2>
                <p className="subtitle">Join Micromart today.</p>

                <form onSubmit={handleSubmit} style={{ textAlign: "left", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    
                    {/* Personal Details */}
                    <div style={{ gridColumn: "span 2" }}><strong>Personal Details</strong></div>
                    
                    <input name="firstName" placeholder="First Name" onChange={handleChange} required style={inputStyle} />
                    <input name="lastName" placeholder="Last Name" onChange={handleChange} required style={inputStyle} />
                    
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} required style={inputStyle} />
                    <input name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} required style={inputStyle} />

                    <select name="gender" onChange={handleChange} style={inputStyle}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non binary">Non binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                        <option value="Transgender">Transgender</option>
                        <option value="Cisgender">Cisgender</option>
                    </select>

                    <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={inputStyle} />

                    {/* Address */}
                    <div style={{ gridColumn: "span 2", marginTop: "10px" }}><strong>Address</strong></div>

                    <input name="street" placeholder="Street Address" onChange={handleAddressChange} required style={{ ...inputStyle, gridColumn: "span 2" }} />
                    
                    <input name="city" placeholder="City" onChange={handleAddressChange} required style={inputStyle} />
                    
                    <select name="state" onChange={handleAddressChange} required style={inputStyle} defaultValue="Lagos">
                        <option value="" disabled>Select State</option>
                        {NIGERIAN_STATES.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                    
                    <input name="country" placeholder="Country" onChange={handleAddressChange} required style={inputStyle} value="Nigeria" />
                    <input name="zipCode" placeholder="Zip Code" onChange={handleAddressChange} required style={inputStyle} />

                    {/* Submit */}
                    <div style={{ gridColumn: "span 2", marginTop: "20px" }}>
                        {status === "error" && <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>}
                        
                        <button type="submit" className="login-btn" disabled={status === "loading"}>
                            {status === "loading" ? "Creating Account..." : "Sign Up"}
                        </button>
                    </div>

                    <div style={{ gridColumn: "span 2", textAlign: "center", marginTop: "10px" }}>
                        <span onClick={() => navigate("/login")} style={{ color: "#007bff", cursor: "pointer" }}>
                            Already have an account? Login
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxSizing: "border-box",
    backgroundColor: "white",
    color: "#333" // 👈 ADD THIS LINE (Dark text)
};;

export default Signup;