import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import WorkshopPage from "./pages/WorkshopPage";
import ExhibitionsPage from "./pages/ExhibitionsPage";
import "./App.css";

function App() {
  return (
    <Router>
      {" "}
      {/* Use Router instead of BrowserRouter */}
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="exhibitions" element={<ExhibitionsPage />} />
        <Route path="/workshops" element={<WorkshopPage />}/>
        <Route path="/shop" element = {<ShopPage />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
