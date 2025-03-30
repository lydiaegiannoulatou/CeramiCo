import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <Router> {/* Use Router instead of BrowserRouter */}
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
