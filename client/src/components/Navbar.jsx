import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { Menu, X, ShoppingBag, User2, LogOut } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { refreshAuth } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <div className="p-6 rounded-2xl bg-[#2F4138] shadow-xl w-72">
          <h4 className="font-display text-xl mb-3 text-center text-white">
            Log out of CeramiCo?
          </h4>
          <p className="font-sans text-sm text-white/80 text-center mb-6">
            You'll need to sign in again to access your account.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => { performLogout(); closeToast(); }}
              className="px-6 py-2.5 rounded-full bg-white text-[#2F4138] hover:bg-white/90 text-sm font-medium transition-colors duration-200"
            >
              Yes, log out
            </button>
            <button
              onClick={closeToast}
              className="px-6 py-2.5 rounded-full border border-white/20 text-white hover:bg-white/10 text-sm transition-colors duration-200"
            >
              Stay signed in
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
        className: "bg-transparent shadow-none",
      }
    );
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className="font-sans text-white/90 hover:text-white transition-colors duration-200 relative group"
      onClick={() => setIsMenuOpen(false)}
    >
      {children}
      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
    </Link>
  );

  return (
    <>
      <nav className="bg-[#7C3C21]/95 backdrop-blur-sm sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="font-display text-2xl text-white hover:text-white/90 transition-colors duration-200">
              CeramiCo
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/exhibitions">Exhibitions</NavLink>
              <NavLink to="/workshops">Workshops</NavLink>
              <NavLink to="/shop">Shop</NavLink>

              {token ? (
                <>
                  {userId && (
                    <Link 
                      to={`/profile/${userId}`}
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                    >
                      <User2 size={20} className="text-white" />
                    </Link>
                  )}
                  {role !== "admin" && (
                    <Link 
                      to="/cart"
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                    >
                      <ShoppingBag size={20} className="text-white" />
                    </Link>
                  )}
                  <button
                    onClick={confirmLogout}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                  >
                    <LogOut size={20} className="text-white" />
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center"
            >
              {isMenuOpen ? (
                <X size={24} className="text-white" />
              ) : (
                <Menu size={24} className="text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#8B4513] border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              <NavLink to="/exhibitions">Exhibitions</NavLink>
              <NavLink to="/workshops">Workshops</NavLink>
              <NavLink to="/shop">Shop</NavLink>

              {token ? (
                <>
                  {userId && <NavLink to={`/profile/${userId}`}>My Profile</NavLink>}
                  {role !== "admin" && <NavLink to="/cart">My Cart</NavLink>}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      confirmLogout();
                    }}
                    className="font-sans text-white/90 hover:text-white transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-6 py-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200 text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <ToastContainer newestOnTop limit={3} />
    </>
  );
};

export default Navbar;