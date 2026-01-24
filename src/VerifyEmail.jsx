import { useEffect, useState, useRef } from "react"; // <--- Import useRef
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("verifying");
    
    // 🚩 Create a ref to track if we already called the API
    const hasCalledAPI = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            return;
        }

        // 🛑 If we already called the API, stop here!
        if (hasCalledAPI.current) {
            return;
        }

        // Mark as called so we don't do it again
        hasCalledAPI.current = true;

        axios.get(`http://127.0.0.1:7082/users/api/v1/auth/verify?token=${token}`)
            .then(() => {
                setStatus("success");
            })
            .catch((error) => {
                console.error("Verification failed", error);
                setStatus("error");
            });
    }, [token]);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {status === "verifying" && <h2>⏳ Verifying...</h2>}
                
                {status === "success" && (
                    <>
                        <h2 style={{ color: "green" }}>✅ Email Verified!</h2>
                        <p>Welcome to Micromart. Your account is active.</p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <h2 style={{ color: "red" }}>❌ Verification Failed</h2>
                        <p>This link is invalid or has expired.</p>
                    </>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
        fontFamily: "Arial, sans-serif"
    },
    card: {
        background: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
        minWidth: "300px"
    }
};

export default VerifyEmail;