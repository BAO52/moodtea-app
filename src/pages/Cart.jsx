import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCart = () => {
    if (!user) return;
    axios
      .get(`http://localhost:3001/cart?userId=${user.id}`)
      .then((res) => setCartItems(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    axios
      .patch(`http://localhost:3001/cart/${id}`, { quantity: newQty })
      .then(() => fetchCart());
  };

  const removeItem = (id) => {
    axios
      .delete(`http://localhost:3001/cart/${id}`)
      .then(() => fetchCart());
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = cartItems.length > 0 ? 1.5 : 0;
  const total = subtotal + shippingFee;

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <div className="card card-custom p-5 shadow-sm">
          <h3 className="fw-bold text-milk-tea mb-3">Your Cart is Empty</h3>
          <p className="text-muted mb-4">Explore our menu to find a drink that matches your mood.</p>
          <div>
            <Link to="/menu" className="btn btn-milk-tea px-4 py-2">
              Back to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-milk-tea mb-4">Shopping Cart</h2>

      <div className="card card-custom p-4 shadow-sm mb-4">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Product</th>
                <th>Options</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Line Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="rounded-3"
                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                      />
                      <span className="fw-bold">{item.name}</span>
                    </div>
                  </td>
                  <td className="small text-muted">
                    Size: {item.size} | Topping: {item.topping}
                  </td>
                  <td>${Number(item.price).toFixed(2)}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        -
                      </button>
                      <span className="fw-bold px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="fw-bold">${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card card-custom p-4 shadow-sm text-end">
        <p className="mb-1">Subtotal: <strong>${subtotal.toFixed(2)}</strong></p>
        <p className="mb-2">Shipping Fee: <strong>${shippingFee.toFixed(2)}</strong></p>
        <h4 className="fw-bold text-milk-tea mb-3">Total: ${total.toFixed(2)}</h4>
        <div className="d-flex justify-content-end gap-3">
          <Link to="/menu" className="btn btn-outline-secondary px-4">
            Continue Shopping
          </Link>
          <button onClick={() => navigate("/checkout")} className="btn btn-milk-tea px-4 fw-bold">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;