// src/pages/Auth/Signup.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Snowfall from "../../components/Snowfall"; 
// 1. Import the CSS Module
import styles from "./Auth.module.css"; 

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
    
    // 👁️ State for password visibility
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

    // 👁️ Function to show password for 2 seconds
    const togglePassword = () => {
        setShowPassword(true);
        setTimeout(() => {
            setShowPassword(false);
        }, 2000); 
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
            <div className={styles.authContainer}>
                <Snowfall />

                <div className={styles.authCard}>
                    <div className={styles.iconCircle}>
                        <svg style={{ color: "#0072ff", width: "35px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <h2 className={styles.title}>Check your Inbox!</h2>
                    <p className={styles.subtitle}>
                        We have sent a verification link to <br/>
                        <strong>{formData.email}</strong>
                    </p>
                    <div className={styles.successMessage}>
                        💡 Click the link in that email to activate your account.
                    </div>
                    <button className={styles.submitBtn} onClick={() => navigate("/login")}>
                        Proceed to Login Page
                    </button>
                </div>
            </div>
        );
    }

    // 📝 Signup Form View
    return (
        <div className={styles.authContainer} style={{overflowY: "auto"}}>
            <Snowfall />

            <div className={styles.authCard} style={{ maxWidth: "600px", marginTop: "20px" }}>
                
                <h2 className={styles.title}>Create Account</h2>
                <p className={styles.subtitle}>Join Micromart today.</p>

                {/* Using the Grid Layout from CSS Module */}
                <form onSubmit={handleSubmit} className={styles.signupForm}>
                    
                    {/* Personal Details Section */}
                    <div className={styles.sectionTitle}>Personal Details</div>
                    
                    <input name="firstName" placeholder="First Name" onChange={handleChange} required className={styles.inputField} />
                    <input name="lastName" placeholder="Last Name" onChange={handleChange} required className={styles.inputField} />
                    
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} required className={styles.inputField} />
                    <input name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} required className={styles.inputField} />

                    <select name="gender" onChange={handleChange} className={styles.inputField}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non binary">Non binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                        <option value="Transgender">Transgender</option>
                        <option value="Cisgender">Cisgender</option>
                    </select>

                    {/* 👁️ Password Input with Eye Icon */}
                    <div className={styles.passwordWrapper}>
                        <input 
                            name="password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            onChange={handleChange} 
                            required 
                            className={styles.inputField}
                            style={{ paddingRight: "40px" }} 
                        />
                        <button 
                            type="button"
                            onClick={togglePassword}
                            className={styles.eyeIcon}
                            title="Show password"
                        >
                            {showPassword ? "🙈" : "👁️"} 
                        </button>
                    </div>

                    {/* Address Section */}
                    <div className={`${styles.sectionTitle} ${styles.fullWidth}`} style={{ marginTop: "15px" }}>Address</div>
                    
                    <input name="street" placeholder="Street Address" onChange={handleAddressChange} required className={`${styles.inputField} ${styles.fullWidth}`} />
                    <input name="city" placeholder="City" onChange={handleAddressChange} required className={styles.inputField} />
                    
                    <select name="state" onChange={handleAddressChange} required className={styles.inputField} defaultValue="Lagos">
                        <option value="" disabled>Select State</option>
                        {NIGERIAN_STATES.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                    
                    <input name="country" placeholder="Country" onChange={handleAddressChange} required className={styles.inputField} value="Nigeria" />
                    <input name="zipCode" placeholder="Zip Code" onChange={handleAddressChange} required className={styles.inputField} />

                    {/* Submit Button */}
                    <div className={styles.fullWidth} style={{ marginTop: "10px" }}>
                        {status === "error" && <p className={styles.errorMsg}>{errorMessage}</p>}
                        <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
                            {status === "loading" ? "Creating Account..." : "Sign Up"}
                        </button>
                    </div>

                    {/* Footer Link */}
                    <div className={`${styles.footerText} ${styles.fullWidth}`} style={{ textAlign: "center", marginTop: "10px" }}>
                        <span onClick={() => navigate("/login")} className={styles.linkSpan}>
                            Already have an account? Login
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;