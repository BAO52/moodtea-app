import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;