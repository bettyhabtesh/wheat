/** @format */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import backgroundImage from "../Assets/sende.png";
import { login, setAuthToken } from "../services/authService";
import LoadingSpinner from "../components/LoadingSpinner";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Sende({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For displaying errors
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);



  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // start loading
  
    try {
      const { access, refresh } = await login(email, password);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);
      setAuthToken(access);
      onLogin();
      navigate("/dashboard");
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Incorrect Username or Password. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false); // stop loading
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  
  

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Sende</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
       <div className="password-container">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <span
  className="toggle-password"
  onClick={() => setShowPassword((prev) => !prev)}
>
  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
</span>

</div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Sende;