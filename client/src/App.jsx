import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import WorkshopPage from "./pages/WorkshopPage";
import WorkshopDetailPage from "./pages/WorkshopDetailsPage";
import WorkshopCheckoutPage from "./pages/WorkshopCheckoutPage";
import ExhibitionsPage from "./pages/ExhibitionsPage";
import ExhibitionDetailsPage from "./pages/ExhibitionDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import SuccessPage from "./pages/SuccessPage";
import FailPage from "./pages/FailPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import FaqPage from "./pages/FaqPage";
import UpdateWorkshop from "./components/UpdateWorkshop";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const { isAuthReady } = useContext(AuthContext);
  if (!isAuthReady) {
    return <div>Loading...</div>;
  }
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exhibitions" element={<ExhibitionsPage />} />
        <Route path="/exhibitions/:id" element={<ExhibitionDetailsPage />} />
        <Route path="/workshops" element={<WorkshopPage />} />
        <Route path="/workshops/:id" element={<WorkshopDetailPage />} />
        <Route
          path="/workshops/:workshopId/sessions/:sessionId"
          element={<WorkshopCheckoutPage />}
        />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<FailPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin/workshops/edit/:id" element={<UpdateWorkshop />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
