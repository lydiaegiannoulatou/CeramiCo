import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminProfile from '../components/AdminProfile';
import UserProfile from '../components/UserProfile';

const ProfilePage = () => {
  const { user, isAuthReady } = useContext(AuthContext);

  if (!isAuthReady) return <p>Loading profile...</p>;

  return user?.role === 'admin' ? <AdminProfile /> : <UserProfile />;
};

export default ProfilePage;
