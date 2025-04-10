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
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

      // if (!username || !email || !password || !name) {
      //   setError("All required fields must be filled!");
      //   return;
      // }

      let newUserInfo = {
        username,
        email,
        password,
        name,
        address,
        phoneNumber,
        enrolled,
      };

      let response = await axios.post(
        "http://localhost:3050/user/register",
        newUserInfo
      );
      console.log("response:",response);
      

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
    <div className="flex-row justify-items-center mt-10">
      <h1>Create new account</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
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
        <div>
          <label>Confirm password:</label>
          <input
            type={showPassword ? "text" : "password"}
            value={verifyPassword}
            placeholder="Verify password"
            onChange={(e) => setVerifyPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            placeholder="Address"
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Phone number:</label>
          <input
            type="text"
            value={phoneNumber}
            placeholder="Phone number"
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div>
          <label>Subscribe to our Newsletter:</label>
          <input
            type="checkbox"
            checked={enrolled}
            onChange={(e) => setEnrolled(e.target.checked)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;
