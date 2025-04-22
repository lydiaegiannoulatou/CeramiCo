import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { refreshAuth } = useContext(AuthContext);

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const checkToken = () => {
      const storedToken = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");

      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            setToken(null);
            setUserId(null);
            setRole(null);
            navigate("/login");
          } else {
            setToken(storedToken);
            setUserId(decoded.userId);
            setRole(storedRole);
          }
        } catch (error) {
          console.error("Invalid token:", error);
          setToken(null);
          setUserId(null);
          setRole(null);
        }
      } else {
        setToken(null);
        setUserId(null);
        setRole(null);
      }
    };

    checkToken();
    const interval = setInterval(checkToken, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setUserId(null);
    setRole(null);
    refreshAuth();
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-orange-800 text-white">
      <h3 className="text-xl font-bold">
        <Link to="/" className="hover:underline">CeramiCo</Link>
      </h3>

      <ul className="flex space-x-6 list-none">
        {/* Shared Links */}
        <li><Link to="/exhibitions">Exhibitions</Link></li>
        <li><Link to="/workshops">Workshops</Link></li>
        <li><Link to="/shop">Shop</Link></li>

        {token ? (
          <>
            {userId && (
              <li>
                <Link to={`/profile/${userId}`}>My Profile</Link>
              </li>
            )}

            {/* Show My Cart only if not admin */}
            {role !== "admin" && (
              <li>
                <Link to="/cart">My Cart</Link>
              </li>
            )}

            <li>
              <button onClick={handleLogout} className="text-white hover:underline">
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
