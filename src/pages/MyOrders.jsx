import { useEffect, useState } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchOrders = () => {
    axios
      .get(`http://localhost:3001/orders?userId=${user.id}`)
      .then((res) => setOrders(res.data));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    axios
      .patch(`http://localhost:3001/orders/${orderId}`, { status: "Cancelled" })
      .then(() => {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: "Cancelled" });
        }
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-milk-tea mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info">You have not placed any orders yet.</div>
      ) : (
        <div className="card card-custom p-4 shadow-sm">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="fw-bold">#{order.id}</td>
                  <td>{order.createdAt}</td>
                  <td className="fw-bold">${Number(order.total).toFixed(2)}</td>
                  <td>
                    <span className="badge bg-secondary">{order.status}</span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="btn btn-outline-dark btn-sm"
                      >
                        View Details
                      </button>
                      {order.status === "Pending" && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="btn btn-danger btn-sm"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div className="card card-custom p-4 shadow-sm mt-4">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
            <h5 className="fw-bold mb-0">Order Details #{selectedOrder.id}</h5>
            <button onClick={() => setSelectedOrder(null)} className="btn btn-sm btn-close" />
          </div>
          <p className="mb-1"><strong>Recipient:</strong> {selectedOrder.shippingName} ({selectedOrder.phone})</p>
          <p className="mb-1"><strong>Address:</strong> {selectedOrder.address}</p>
          <p className="mb-3"><strong>Note:</strong> {selectedOrder.note || "None"}</p>
          <ul className="list-group mb-3">
            {selectedOrder.items.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between">
                <span>{item.name} (Size: {item.size}, Topping: {item.topping}) x{item.quantity}</span>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </li>
            ))}
          </ul>
          <h5 className="text-end fw-bold text-milk-tea">
            Total Paid: ${Number(selectedOrder.total).toFixed(2)}
          </h5>
        </div>
      )}
    </div>
  );
};

export default MyOrders;