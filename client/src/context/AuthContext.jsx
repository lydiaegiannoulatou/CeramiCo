import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp < currentTime) {
                    // If expired, remove the token and log out the user
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                } else {
                    // If token is valid, keep the user logged in
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error("Invalid token:", error);
                // If the token is invalid, log out the user
                localStorage.removeItem("token");
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false); // No token found, user is logged out
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
