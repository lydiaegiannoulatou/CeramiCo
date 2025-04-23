import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const navigate      = useNavigate();
  const { refreshAuth } = useContext(AuthContext);

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role"));

  /* ---------- TOKEN LIFECYCLE ---------- */
  useEffect(() => {
    const validate = () => {
      const t = localStorage.getItem("token");
      const r = localStorage.getItem("role");

      if (!t) return (setToken(null), setUserId(null), setRole(null));

      try {
        const { exp, userId } = jwtDecode(t);
        if (Date.now() / 1000 > exp) {
          localStorage.clear();
          setToken(null); setUserId(null); setRole(null);
          navigate("/login");
        } else { setToken(t); setUserId(userId); setRole(r); }
      } catch {
        localStorage.clear();
        setToken(null); setUserId(null); setRole(null);
      }
    };

    validate();
    const iv = setInterval(validate, 10000);
    return () => clearInterval(iv);
  }, [navigate]);

  /* ---------- LOGOUT ROUTINE ---------- */
  const performLogout = useCallback(() => {
    localStorage.clear();
    setToken(null); setUserId(null); setRole(null);
    refreshAuth();
    navigate("/");
  }, [refreshAuth, navigate]);

  /* ---------- TOAST CONFIRM ---------- */
  const confirmLogout = () => {
    toast(
      ({ closeToast }) => (
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 shadow-xl w-72">
          <h4 className="font-semibold text-lg mb-2 text-center">
            Log out of CeramiCo?
          </h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mb-4">
            You’ll need to sign in again to access your account.
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => { performLogout(); closeToast(); }}
              className="px-4 py-1.5 rounded-lg bg-orange-700 hover:bg-orange-800 text-white text-sm font-medium"
            >
              Yes, log me out
            </button>
            <button
              onClick={closeToast}
              className="px-4 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm"
            >
              Stay
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        className: "bg-transparent shadow-none",   // let our inner card style show
      }
    );
  };

  /* ---------- RENDER ---------- */
  return (
    <>
      <nav className="flex justify-between items-center p-4 bg-orange-800 text-white">
        <h1 className="text-xl font-bold">
          <Link to="/" className="hover:underline">CeramiCo</Link>
        </h1>

        <ul className="flex space-x-6">
          <li><Link to="/exhibitions">Exhibitions</Link></li>
          <li><Link to="/workshops">Workshops</Link></li>
          <li><Link to="/shop">Shop</Link></li>

          {token ? (
            <>
              {userId && <li><Link to={`/profile/${userId}`}>My Profile</Link></li>}
              {role !== "admin" && <li><Link to="/cart">My Cart</Link></li>}

              <li>
                <button onClick={confirmLogout} className="hover:underline">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </nav>

      {/* Toast mount‑point */}
      <ToastContainer newestOnTop limit={3} />
    </>
  );
};

export default Navbar;
