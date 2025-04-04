import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:3050/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Send token
          },
        });
        setUser(data); // Store user data in state
        
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser(); // Call the function
  }, [navigate]); // Dependency array ensures it runs only on mount

  useEffect(() => {
    if (user) console.log("Updated user data:", user);
  }, [user]);

  if (!user) return <p>Loading...</p>;
console.log(user.role);

  return (
    <div className="container">
      <h2>Welcome, {user.name}!</h2>

      {user.role === "admin" ? (
        <div>
          <h3>Admin Panel</h3>
          <button onClick={() => navigate("/admin/products")}>
            Manage Products
          </button>
          <button onClick={() => navigate("/admin/users")}>Manage Users</button>
        </div>
      ) : (
        <div>
          <h3>Your Orders</h3>
          <button onClick={() => navigate("/orders")}>View Orders</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
