import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import WorkshopPage from "./pages/WorkshopPage";
import WorkshopDetailPage from "./pages/WorkshopDetailsPage";
import ExhibitionsPage from "./pages/ExhibitionsPage";
import ExhibitionDetailsPage from "./pages/ExhibitionDetailsPage";
import AdminExhibitionModal from "./components/AdminExhibitionModal";
import ProfilePage from "./pages/ProfilePage"
import Cart from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import SuccessPage from "./pages/SuccessPage";
import AdminOrderPage from "./pages/AdminOrderPage"
import NewsletterPage from "./pages/NewsletterPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exhibitions" element={<ExhibitionsPage />} />
        <Route path="/exhibitions/:id" element={<ExhibitionDetailsPage />} />
        <Route path="/exhibitions/add" element = {<AdminExhibitionModal/>}/>
        <Route path="/workshops" element={<WorkshopPage />}/>
        <Route path="/workshops/:id" element={<WorkshopDetailPage />} />
        <Route path="/shop" element = {<ShopPage />}/>
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/cart" element = {<Cart />}/>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/admin/orders" element={<AdminOrderPage />} />
        <Route path="/admin/newsletter" element={<NewsletterPage />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={1500} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </Router>
  );
}

export default App;
