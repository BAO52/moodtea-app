import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3001";

const theme = {
  orange: "#f47721",
  ink: "#20212a",
  muted: "#777985",
  line: "#eeeef0",
};

const pageFont = {
  fontFamily: "'DM Sans', sans-serif",
  color: theme.ink,
};

const headingFont = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
};

const sectionTitle = {
  ...headingFont,
  fontSize: 26,
  fontWeight: 800,
  letterSpacing: "-.8px",
};

const kickerStyle = {
  color: "#c68a59",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "1.5px",
};

const orangeButton = {
  background: theme.orange,
  color: "#fff",
  border: 0,
  borderRadius: 10,
  padding: "10px 20px",
  fontWeight: 700,
  fontSize: 12,
};

const cardStyle = {
  border: `1px solid ${theme.line}`,
  borderRadius: 16,
  background: "#fff",
  boxShadow: "0 6px 20px rgba(30,30,40,.04)",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error("Cannot load orders:", err);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.patch(`${API_URL}/orders/${orderId}`, { status: newStatus });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return { color: "#27834b", background: "#eaf7ee" };
      case "Pending":
        return { color: "#d96b1f", background: "#fff2e5" };
      case "Confirmed":
        return { color: "#2563eb", background: "#eff6ff" };
      case "Cancelled":
        return { color: "#c34d4d", background: "#fff0f0" };
      default:
        return { color: "#6b7280", background: "#f3f4f6" };
    }
  };

  const filteredOrders = useMemo(() => {
    if (filterStatus === "All") return orders;
    return orders.filter((o) => o.status === filterStatus);
  }, [orders, filterStatus]);

  return (
    <div style={{ ...pageFont, minHeight: "100vh", background: "#faf9f8" }} className="py-4 px-3 px-md-4">
      <div className="container-fluid" style={{ maxWidth: 1320 }}>
        <div className="row g-4">
          {/* Panel Bên Trái */}
          <div className="col-md-3 col-lg-2">
            <div
              className="p-3 shadow-sm d-flex flex-column"
              style={{
                background: "#fff",
                border: `1px solid ${theme.line}`,
                borderRadius: 18,
                position: "sticky",
                top: 20,
              }}
            >
              <div className="border-bottom pb-3 mb-3 text-center text-md-start">
                <Link to="/" className="text-decoration-none fw-bold" style={{ color: theme.orange, ...headingFont, fontSize: 24, letterSpacing: "-1px" }}>
                  MoodTea
                </Link>
                <div className="small text-muted mt-1" style={{ fontSize: 11 }}>Admin Management</div>
              </div>

              <div className="d-flex flex-column gap-2 mb-4">
                <Link to="/admin" className="btn text-start" style={{ color: "#444", borderRadius: 10, fontSize: 13, border: "none" }}>
                  Dashboard
                </Link>
                <Link to="/admin/products" className="btn text-start" style={{ color: "#444", borderRadius: 10, fontSize: 13, border: "none" }}>
                  Products
                </Link>
                <Link to="/admin/categories" className="btn text-start" style={{ color: "#444", borderRadius: 10, fontSize: 13, border: "none" }}>
                  Categories
                </Link>
                <Link
                  to="/admin/orders"
                  className="btn text-start fw-bold"
                  style={{ background: "#fff2e5", color: theme.orange, borderRadius: 10, fontSize: 13, border: "none" }}
                >
                  Orders
                </Link>
                <Link to="/admin/customers" className="btn text-start" style={{ color: "#444", borderRadius: 10, fontSize: 13, border: "none" }}>
                  Customers
                </Link>
              </div>

              <div className="border-top pt-3 mt-auto">
                <div className="small fw-semibold text-truncate mb-2" style={{ color: theme.ink }}>
                  {user?.name || "Sarah Admin"}
                </div>
                <button
                  onClick={handleLogout}
                  className="btn w-100 text-start"
                  style={{ background: "#fff0f0", color: "#c44e4e", borderRadius: 10, fontSize: 12, fontWeight: 700, border: "none" }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Nội dung danh sách đơn hàng */}
          <div className="col-md-9 col-lg-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span style={kickerStyle}>ORDER PROCESSING</span>
                <h1 className="mt-1 mb-0" style={sectionTitle}>Order Management</h1>
              </div>
            </div>

            <div className="p-4 bg-white" style={cardStyle}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                  <h3 className="fw-bolder mb-1" style={{ ...headingFont, fontSize: 18 }}>
                    All Orders
                    <span className="badge rounded-pill ms-2" style={{ background: "#fff0e5", color: theme.orange, fontSize: 11 }}>
                      {orders.length}
                    </span>
                  </h3>
                  <p className="mb-0 small text-muted">Cập nhật và chuyển trạng thái đơn hàng</p>
                </div>

                {/* Filter Pills */}
                <div className="d-flex gap-2 flex-wrap">
                  {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className="btn btn-sm rounded-pill px-3"
                      style={
                        filterStatus === status
                          ? { background: theme.orange, color: "#fff", fontWeight: 700, fontSize: 11 }
                          : { background: "#f4f4f6", color: theme.muted, fontWeight: 600, fontSize: 11, border: "none" }
                      }
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr style={{ background: "#fffaf6" }}>
                      <th className="small text-secondary">ORDER ID</th>
                      <th className="small text-secondary">CUSTOMER</th>
                      <th className="small text-secondary">ORDER DATE</th>
                      <th className="small text-secondary">TOTAL AMOUNT</th>
                      <th className="small text-secondary">STATUS</th>
                      <th className="small text-secondary">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...filteredOrders].reverse().map((o) => {
                      const badge = getStatusBadge(o.status);
                      return (
                        <tr key={o.id}>
                          <td className="fw-bold small" style={{ color: theme.ink }}>#{o.id}</td>
                          <td>
                            <strong className="d-block small" style={{ color: theme.ink }}>{o.shippingName}</strong>
                            <small className="text-muted" style={{ fontSize: 11 }}>{o.phone}</small>
                          </td>
                          <td className="small text-muted">{o.createdAt}</td>
                          <td className="small fw-bold" style={{ color: theme.orange }}>${Number(o.total || 0).toFixed(2)}</td>
                          <td>
                            <select
                              className="form-select form-select-sm border-0 fw-semibold"
                              style={{
                                color: badge.color,
                                background: badge.background,
                                fontSize: 11,
                                borderRadius: 8,
                                width: "auto",
                                cursor: "pointer",
                              }}
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
                              type="button"
                              className="btn btn-sm py-1 px-3"
                              style={{ background: "#eef5ff", color: "#3973bb", borderRadius: 8, fontSize: 11, fontWeight: 700 }}
                              onClick={() => setSelectedOrder(o)}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted small">No orders found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup Chi Tiết Đơn Hàng */}
      {selectedOrder && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ zIndex: 100, background: "rgba(24,22,20,.48)" }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-4 shadow-lg p-4 w-100 position-relative overflow-auto"
            style={{ maxWidth: 540, maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3"
              style={{ width: 32, height: 32, padding: 0 }}
              onClick={() => setSelectedOrder(null)}
            >
              ×
            </button>
            <span style={kickerStyle}>ORDER SUMMARY</span>
            <h3 className="fw-bolder mt-1 mb-3" style={headingFont}>Order #{selectedOrder.id}</h3>

            <div className="p-3 rounded-3 mb-3" style={{ background: "#fffaf6", border: "1px solid #f6eee5" }}>
              <div className="small mb-1"><strong>Customer:</strong> {selectedOrder.shippingName} ({selectedOrder.phone})</div>
              <div className="small mb-1"><strong>Address:</strong> {selectedOrder.address}</div>
              <div className="small mb-0"><strong>Note:</strong> {selectedOrder.note || "No notes"}</div>
            </div>

            <div className="small fw-bold text-secondary mb-2">ITEMS ORDERED</div>
            <div className="d-flex flex-column gap-2 mb-3">
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="d-flex justify-content-between align-items-center p-2 rounded-2 border">
                  <div>
                    <div className="fw-bold small">{item.name}</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>
                      Size: {item.size || "M"} | Topping: {item.topping || "None"}
                      {item.sugar && ` | Sugar: ${item.sugar}`}
                      {item.ice && ` | Ice: ${item.ice}`}
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="small text-muted">x{item.quantity}</span>
                    <div className="fw-bold small" style={{ color: theme.orange }}>
                      ${(Number(item.price || 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between py-2 border-top small">
              <span>Subtotal</span>
              <strong>${Number(selectedOrder.subtotal || selectedOrder.total || 0).toFixed(2)}</strong>
            </div>
            <div className="d-flex justify-content-between py-1 small">
              <span>Shipping Fee</span>
              <strong>${Number(selectedOrder.shippingFee || 1.5).toFixed(2)}</strong>
            </div>
            <div className="d-flex justify-content-between py-2 border-top fs-5 fw-bold" style={{ color: theme.orange }}>
              <span>Total Amount</span>
              <span>${Number(selectedOrder.total || 0).toFixed(2)}</span>
            </div>

            <button type="button" className="btn w-100 text-white mt-3" style={orangeButton} onClick={() => setSelectedOrder(null)}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;