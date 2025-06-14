import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [name, setName] = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const baseUrl = import.meta.env.VITE_BASE_URL;
  //_____Password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  async function handleRegister(e) {
    try {
      e.preventDefault();

      if (password !== verifyPassword) {
        setError("Passwords do not match!");
        return;
      }
      setError("");

   
      let newUserInfo = {
        username,
        email,
        password,
        name,
        enrolled,
      };

      let response = await axios.post(
        `${baseUrl}/user/register`,
        newUserInfo
      );
      console.log("response:", response);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        alert(response.data.msg);
        navigate("/");
      } else {
        setError("Registration was successful, but no token was received.");
      }
    } catch (error) {
      alert(error.response.data.msg);
      console.log(error);
    }
  }

  return (
     <section
      className="min-h-screen flex items-center justify-center bg-[#f7f4ea] px-4 bg-cover bg-center"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/drszm8sem/image/upload/v1748372325/talented-woman-doing-pottery_r34bpr.jpg')`,
      }}
    >
      <div className="w-full max-w-lg bg-[#eee6d2]/90 shadow-xl rounded-2xl p-12">
        <h1 className="font-serif text-3xl text-center mb-10">
          Create new account
        </h1>

        {error && (
          <p className="mb-6 text-sm text-center text-red-600">{error}</p>
        )}

        <form className="space-y-6" onSubmit={handleRegister}>
          {/* username */}
          <input
            type="text"
            value={username}
            placeholder="Username*"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border-b border-gray-400 bg-transparent py-2 placeholder:italic focus:border-[#713818] focus:outline-none"
            required
          />

          {/* email */}
          <input
            type="email"
            value={email}
            placeholder="Email*"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-gray-400 bg-transparent py-2 placeholder:italic focus:border-[#713818] focus:outline-none"
            required
          />

          {/* password + confirm + toggle */}
          <div className="flex items-center gap-4 border-b border-gray-400 focus-within:border-[#713818]">
            {/* Password */}
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Password*"
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent py-2 placeholder:italic focus:outline-none"
              required
            />

            {/* Confirm password */}
            <input
              type={showPassword ? "text" : "password"}
              value={verifyPassword}
              placeholder="Confirm*"
              onChange={(e) => setVerifyPassword(e.target.value)}
              className="flex-1 bg-transparent py-2 placeholder:italic focus:outline-none"
              required
            />

            {/* Visibility toggle */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="shrink-0 pb-1 text-gray-500"
              aria-label={showPassword ? "Hide passwords" : "Show passwords"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* full name */}
          <input
            type="text"
            value={name}
            placeholder="Full name*"
            onChange={(e) => setName(e.target.value)}
            className="w-full border-b border-gray-400 bg-transparent py-2 placeholder:italic focus:border-[#713818] focus:outline-none"
            required
          />

          {/* newsletter opt‑in */}
          <div className="flex items-center justify-between">
            {/* checkbox + text */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={enrolled}
                onChange={(e) => setEnrolled(e.target.checked)}
                className="h-4 w-4 accent-[#713818] rounded-sm"
              />
              Subscribe to our Newsletter
            </label>

            {/* right‑aligned note */}

            <p className="text-xs italic text-gray-500 ml-1">
              * required fields
            </p>
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={
              !username || !email || !password || !verifyPassword || !name
            }
            className="w-full bg-[#713818] hover:bg-[#5d2f15] disabled:opacity-50 disabled:cursor-not-allowed text-[#f7f4ea] py-3 rounded-md tracking-wide transition-colors"
          >
            Sign up
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
