import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [shippingName, setShippingName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [note, setNote] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3001/cart?userId=${user.id}`)
      .then((res) => setCartItems(res.data));
  }, [user.id]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = cartItems.length > 0 ? 1.5 : 0;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const newOrder = {
      userId: user.id,
      shippingName,
      phone,
      address,
      note,
      items: cartItems,
      subtotal,
      shippingFee,
      total,
      status: "Pending",
      createdAt: new Date().toISOString().split("T")[0],
    };

    try {
      const res = await axios.post("http://localhost:3001/orders", newOrder);
      for (const item of cartItems) {
        await axios.delete(`http://localhost:3001/cart/${item.id}`);
      }
      alert(`Order placed successfully! Your Order ID is #${res.data.id}`);
      navigate("/my-orders");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-milk-tea mb-4">Checkout</h2>
      <div className="row g-4">
        <div className="col-md-7">
          <form onSubmit={handlePlaceOrder} className="card card-custom p-4 shadow-sm">
            <h4 className="fw-bold mb-3">Delivery Information</h4>
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name *</label>
              <input
                type="text"
                required
                className="form-control"
                value={shippingName}
                onChange={(e) => setShippingName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Phone Number *</label>
              <input
                type="text"
                required
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Delivery Address *</label>
              <input
                type="text"
                required
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Order Note</label>
              <textarea
                className="form-control"
                rows="3"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-milk-tea py-2 fw-bold w-100">
              Place Order
            </button>
          </form>
        </div>

        <div className="col-md-5">
          <div className="card card-custom p-4 shadow-sm">
            <h4 className="fw-bold mb-3">Order Summary</h4>
            <ul className="list-group list-group-flush mb-3">
              {cartItems.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between px-0">
                  <span>{item.name} (x{item.quantity}) - {item.size}</span>
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                </li>
              ))}
            </ul>
            <p className="d-flex justify-content-between mb-1">
              <span>Subtotal:</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </p>
            <p className="d-flex justify-content-between mb-2">
              <span>Shipping Fee:</span>
              <strong>${shippingFee.toFixed(2)}</strong>
            </p>
            <h4 className="d-flex justify-content-between fw-bold text-milk-tea border-top pt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;