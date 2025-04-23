import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminProfile from "../ProfileAdmin/AdminProfile"
import UserProfile from '../ProfileUser/UserProfile';

const ProfilePage = () => {
  const { user, isAuthReady } = useContext(AuthContext);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Only update role once user is ready and defined
    if (isAuthReady && user) {
      setRole(user.role);
    } else if (isAuthReady && !user) {
      setRole(null); // for logged-out case
    }
  }, [user, isAuthReady]);

  if (!isAuthReady || role === null) {
    return <p>Loading profile...</p>;
  }

  return role === 'admin' ? <AdminProfile /> : <UserProfile />;
};

export default ProfilePage;
