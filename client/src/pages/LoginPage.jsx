import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate()
  const { refreshAuth } = useContext(AuthContext);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  //_____Password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
  
    if (!usernameOrEmail || !password) {
      setError("Both username/email and password are required.");
      return;
    }
  
    const isEmail = /\S+@\S+\.\S+/.test(usernameOrEmail);
  
    let userInfo = {
      password,
      ...(isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail }),
    };
  
    try {
      let response = await axios.post(
        "http://localhost:3050/user/login",
        userInfo
      );
  
      localStorage.setItem("token", response.data.token);
      const decodedToken = jwtDecode(response.data.token);
      localStorage.setItem("role", decodedToken.role);
  
      refreshAuth(); // 🔥 This is what makes the magic happen
  
      alert(response.data.msg);
      navigate("/");
    } catch (error) {
      alert(error.response.data.msg);
      console.log(error);
    }
  }
  

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f7f4ea] px-4">
      <div className="w-full max-w-md bg-[#eee6d2]/70 shadow-lg rounded-xl p-12">
        <h2 className="font-serif text-3xl text-center mb-10">Login</h2>

        {error && (
          <p className="mb-4 text-sm text-red-600 text-center">{error}</p>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email or Username"
            value={usernameOrEmail}
            onChange={e => setUsernameOrEmail(e.target.value)}
            className="w-full border-b border-gray-400 bg-transparent focus:outline-none focus:border-[#713818] placeholder:italic placeholder:text-gray-500 py-2"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border-b border-gray-400 bg-transparent focus:outline-none focus:border-[#713818] placeholder:italic placeholder:text-gray-500 py-2 pr-10"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <Link
            to="/forgot-password"
            className="block text-sm text-right text-[#713818] hover:underline"
          >
            Forgot your password?
          </Link>

          <button
            type="submit"
            className="w-full mt-2 bg-[#713818] hover:bg-[#5d2f15] text-[#f7f4ea] py-2 rounded-md tracking-wide transition"
          >
            Sign In
          </button>
        </form>

        <div className="mt-10 flex items-center justify-between text-sm">
        
          <Link
            to="/register"
            className="inline-flex items-center gap-1 text-[#713818] hover:underline"
          >
            <span>Register</span>
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Login;
