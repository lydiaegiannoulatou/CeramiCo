import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const syncAuthState = () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUser(null);
        } else {
          setIsLoggedIn(true);
          setUser(decodedToken);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }

    setIsAuthReady(true);
  };

  useEffect(() => {
    syncAuthState();

    // 👇 Listen for token changes across tabs/windows
    const onStorageChange = (e) => {
      if (e.key === "token") {
        syncAuthState();
      }
    };

    window.addEventListener("storage", onStorageChange);

    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isAuthReady,
        refreshAuth: syncAuthState, // expose function to manually trigger refresh
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
