import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const checkToken = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000; // in seconds
          if (decoded.exp < currentTime) {
            // Token expired
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            setToken(null);
            setUserId(null);
            navigate("/login");
          } else {
            setToken(storedToken);
            setUserId(decoded.userId);
          }
        } catch (error) {
          console.error("Invalid token:", error);
          setToken(null);
        }
      } else {
        setToken(null);
        setUserId(null);
      }
    };

    checkToken(); // Initial check
    const interval = setInterval(checkToken, 1000 * 10); // check every 10 seconds

    return () => clearInterval(interval); // Cleanup
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setUserId(null);
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-orange-800">
      <h3 className="text-xl font-bold">
        <Link to="/">CeramiCo</Link>
      </h3>
      <ul className="flex space-x-6 list-none">
        {token ? (
          <>
            <li>
              <Link to="/exhibitions">Exhibitions</Link>
            </li>
            <li>
              <Link to="/workshops">Workshops</Link>
            </li>
            <li>
              <Link to="/shop">Shop</Link>
            </li>
            {userId && (
              <li>
                <Link to={`/profile/${userId}`}>My Profile</Link>
              </li>
            )}
            <li>
              <Link to="/cart">My Cart</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="text-white">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/exhibitions">Exhibitions</Link>
            </li>
            <li>
              <Link to="/workshops">Workshops</Link>
            </li>
            <li>
              <Link to="/shop">Shop</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
