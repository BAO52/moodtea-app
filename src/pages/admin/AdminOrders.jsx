import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3001/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:3001/orders/${orderId}`, {
        status: newStatus,
      });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-milk-tea">Order Management</h2>
        <Link to="/admin" className="btn btn-outline-secondary">
          Back to Dashboard
        </Link>
      </div>

      <div className="card card-custom p-4 shadow-sm">
        <div className="table-responsive">
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
                  <td className="fw-bold text-milk-tea">
                    ${Number(o.total || 0).toFixed(2)}
                  </td>
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
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="card card-custom p-4 shadow-sm mt-4">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
            <h5 className="fw-bold mb-0">Order Details #{selectedOrder.id}</h5>
            <button
              onClick={() => setSelectedOrder(null)}
              className="btn btn-sm btn-close"
            />
          </div>
          <p className="mb-1"><strong>Customer:</strong> {selectedOrder.shippingName}</p>
          <p className="mb-1"><strong>Phone:</strong> {selectedOrder.phone}</p>
          <p className="mb-1"><strong>Delivery Address:</strong> {selectedOrder.address}</p>
          <p className="mb-3"><strong>Note:</strong> {selectedOrder.note || "None"}</p>
          <ul className="list-group mb-3">
            {selectedOrder.items?.map((item, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <span className="fw-bold">{item.name}</span>
                  <div className="small text-muted">
                    Size: {item.size || "M"} | Topping: {item.topping || "None"}
                    {item.sugar && ` | Sugar: ${item.sugar}`}
                    {item.ice && ` | Ice: ${item.ice}`}
                  </div>
                </div>
                <span>
                  x{item.quantity} &nbsp;&bull;&nbsp;{" "}
                  <strong>${(Number(item.price || 0) * item.quantity).toFixed(2)}</strong>
                </span>
              </li>
            ))}
          </ul>
          <h5 className="text-end fw-bold text-milk-tea">
            Total: ${Number(selectedOrder.total || 0).toFixed(2)}
          </h5>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;