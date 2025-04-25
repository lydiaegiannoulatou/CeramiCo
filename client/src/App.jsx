import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import ProfilePage from "./pages/ProfilePage"
import CartPage from "./pages/CartPage"
import SuccessPage from "./pages/SuccessPage";
import FailPage from "./pages/FailPage"
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import FaqPage from "./pages/FaqPage";
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
        <Route path="/workshops" element={<WorkshopPage />}/>
        <Route path="/workshops/:id" element={<WorkshopDetailPage />} />
        <Route path="/workshops/:workshopId/sessions/:sessionId" element={<WorkshopCheckoutPage />} />
        <Route path="/shop" element = {<ShopPage />}/>
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/cart" element = {<CartPage />}/>
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<FailPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />       
       </Routes>
       <Footer />
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </Router>
  );
}

export default App;
