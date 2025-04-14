import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import WorkshopPage from "./pages/WorkshopPage";
import ExhibitionsPage from "./pages/ExhibitionsPage";
import ProfilePage from "./pages/ProfilePage"
import Cart from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import "./App.css";
import SuccessPage from "./pages/SuccessPage";

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
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/cart" element = {<Cart />}/>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;
