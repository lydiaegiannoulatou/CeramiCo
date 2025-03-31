import { useState } from "react";
import axios from "axios";
import { data, Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate()
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

    // Check if the input is an email
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
      localStorage.setItem("role", response.data.role)
      alert(response.data.msg);
      navigate("/")
    } catch (error) {
      alert(error.response.data.msg);
      console.log(error);
    }
  }

  return (
    <div className="flex-row justify-items-center mt-20">
      <h1 className="font-bold mb-8">Login</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="flex-row justify-items-center" onSubmit={handleLogin}>
        <div>
          {/* <label>Username / Email:</label> */}
          <input
            type="text"
            value={usernameOrEmail}
            placeholder="Enter Username or Email"
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
          />
        </div>
        <div className="">
          {/* <label>Password:</label> */}
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="p-2"
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>
        <Link>Forgot your password?</Link>
        <div>
          <input
            type="submit"
            value="Login"
            className="w-md bg-blue-500 text-white py-2 rounded-lg mt-8"
          />
        </div>
      </form>
      <Link to="/register">Create account</Link>
    </div>
  );
};

export default Login;
