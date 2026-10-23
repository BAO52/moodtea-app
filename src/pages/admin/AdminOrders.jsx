import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = () => {
    axios.get("http://localhost:3001/orders").then((res) => setOrders(res.data));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    await axios.patch(`http://localhost:3001/orders/${orderId}`, { status: newStatus });
    fetchOrders();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-milk-tea">Order Management</h2>
        <Link to="/admin" className="btn btn-outline-secondary">Back to Dashboard</Link>
      </div>

      <div className="card card-custom p-4 shadow-sm">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="fw-bold">#{o.id}</td>
                <td>{o.shippingName}</td>
                <td>{o.createdAt}</td>
                <td className="fw-bold">${Number(o.total).toFixed(2)}</td>
                <td>
                  <select
                    className="form-select form-select-sm w-auto"
                    value={o.status}
                    onChange={(e) => handleStatusUpdate(o.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="btn btn-info btn-sm text-white"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="card card-custom p-4 shadow-sm mt-4">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
            <h5 className="fw-bold mb-0">Order Details #{selectedOrder.id}</h5>
            <button onClick={() => setSelectedOrder(null)} className="btn btn-sm btn-close" />
          </div>
          <p className="mb-1"><strong>Customer:</strong> {selectedOrder.shippingName}</p>
          <p className="mb-1"><strong>Phone:</strong> {selectedOrder.phone}</p>
          <p className="mb-1"><strong>Delivery Address:</strong> {selectedOrder.address}</p>
          <p className="mb-3"><strong>Note:</strong> {selectedOrder.note || "None"}</p>
          <ul className="list-group mb-3">
            {selectedOrder.items.map((item, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between">
                <span>{item.name} (Size: {item.size}, Topping: {item.topping}) x{item.quantity}</span>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </li>
            ))}
          </ul>
          <h5 className="text-end fw-bold text-milk-tea">
            Total: ${Number(selectedOrder.total).toFixed(2)}
          </h5>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;