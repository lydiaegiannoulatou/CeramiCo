import { Link, useNavigate } from "react-router-dom";
// import React, { useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const navigate = useNavigate();
  let token = null;
  let decodedToken = null;

  try {
    if (localStorage.getItem("token")) {
      token = localStorage.getItem("token");
      decodedToken = jwtDecode(token);
      console.log(decodedToken);
    }
  } catch (error) {
    console.log(error);
  }
  //_____handle log out

  function handleLogout() {
    try {
      if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex justify-between items-center p-4 bg-orange-800">
      <h3 className="text-xl font-bold">
        <Link to="/">CeramiCo</Link>
      </h3>
      <ul
        style={{ display: "flex", justifyContent: "space-between" }}
        className="flex space-x-6 list-none"
      >
        {token ? (
          <>
            <li>
              <Link to="exhibitions">Exhibitions</Link>
            </li>
            <li>
              <Link to="workshops">Workshops</Link>
            </li>
            <li>
              <Link to="/shop">Shop</Link>
            </li>
            <li>
              <Link to="/profile">My Profile</Link></li>
            <li> <Link to="/cart">My Cart</Link></li>
            <li>
              <Link onClick={handleLogout} to="/">
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="exhibitions">Exhibitions</Link>
            </li>
            <li>
              <Link to="workshops">Workshops</Link>
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
