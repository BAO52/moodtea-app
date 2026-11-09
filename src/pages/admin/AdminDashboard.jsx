import { useEffect, useState } from "react";
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

const cardStyle = {
  border: `1px solid ${theme.line}`,
  borderRadius: 16,
  background: "#fff",
  boxShadow: "0 6px 20px rgba(30,30,40,.04)",
};

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    axios.get(`${API_URL}/products`).then((res) => setProducts(res.data)).catch(console.error);
    axios.get(`${API_URL}/orders`).then((res) => setOrders(res.data)).catch(console.error);
    axios.get(`${API_URL}/users`).then((res) => setUsers(res.data)).catch(console.error);
  }, []);

  const customersCount = users.filter((u) => u.role === "Customer").length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/login");
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

  return (
    <div style={{ ...pageFont, minHeight: "100vh", background: "#faf9f8" }} className="py-4 px-3 px-md-4">
      <div className="container-fluid" style={{ maxWidth: 1320 }}>
        <div className="row g-4">
          {/* Sidebar / Admin Panel bên trái */}
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
                <Link
                  to="/admin"
                  className="btn text-start fw-bold"
                  style={{ background: "#fff2e5", color: theme.orange, borderRadius: 10, fontSize: 13, border: "none" }}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/products"
                  className="btn text-start"
                  style={{ color: "#444", borderRadius: 10, fontSize: 13, border: "none" }}
                >
                  Products
                </Link>
                <Link
                  to="/admin/categories"
                  className="btn text-start"
                  style={{ color: "#444", borderRadius: 10, fontSize: 13, border: "none" }}
                >
                  Categories
                </Link>
                <Link
                  to="/admin/orders"
                  className="btn text-start"
                  style={{ color: "#444", borderRadius: 10, fontSize: 13, border: "none" }}
                >
                  Orders
                </Link>
                <Link
                  to="/admin/customers"
                  className="btn text-start"
                  style={{ color: "#444", borderRadius: 10, fontSize: 13, border: "none" }}
                >
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

          {/* Main Dashboard Content */}
          <div className="col-md-9 col-lg-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span style={kickerStyle}>OVERVIEW</span>
                <h1 className="mt-1 mb-0" style={sectionTitle}>Admin Dashboard</h1>
              </div>
            </div>

            {/* 4 Thẻ KPI */}
            <div className="row g-3 mb-4">
              <div className="col-sm-6 col-lg-3">
                <div className="p-4 h-100" style={cardStyle}>
                  <div className="small fw-bold text-uppercase" style={{ color: theme.muted, letterSpacing: "0.5px" }}>Total Drinks</div>
                  <h2 className="fw-bolder mt-2 mb-0" style={{ ...headingFont, color: theme.ink }}>{products.length}</h2>
                  <span className="small text-muted mt-2 d-block">Món trong thực đơn</span>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="p-4 h-100" style={cardStyle}>
                  <div className="small fw-bold text-uppercase" style={{ color: theme.muted, letterSpacing: "0.5px" }}>Customers</div>
                  <h2 className="fw-bolder mt-2 mb-0" style={{ ...headingFont, color: theme.ink }}>{customersCount}</h2>
                  <span className="small text-muted mt-2 d-block">Tài khoản khách hàng</span>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="p-4 h-100" style={cardStyle}>
                  <div className="small fw-bold text-uppercase" style={{ color: "#d96b1f", letterSpacing: "0.5px" }}>Pending Orders</div>
                  <h2 className="fw-bolder mt-2 mb-0" style={{ ...headingFont, color: theme.orange }}>{pendingOrders}</h2>
                  <span className="small text-muted mt-2 d-block">Đơn chờ pha chế</span>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="p-4 h-100" style={cardStyle}>
                  <div className="small fw-bold text-uppercase" style={{ color: "#27834b", letterSpacing: "0.5px" }}>Total Revenue</div>
                  <h2 className="fw-bolder mt-2 mb-0" style={{ ...headingFont, color: "#27834b" }}>${totalRevenue.toFixed(2)}</h2>
                  <span className="small text-muted mt-2 d-block">Doanh thu đơn hợp lệ</span>
                </div>
              </div>
            </div>

            {/* Bảng Recent Orders & Featured Products */}
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="p-4 bg-white" style={cardStyle}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <span style={kickerStyle}>LIVE TRANSACTIONS</span>
                      <h3 className="fw-bolder mt-1 mb-0" style={{ ...headingFont, fontSize: 18 }}>Recent Orders</h3>
                    </div>
                    <Link to="/admin/orders" className="text-decoration-none fw-bold small" style={{ color: theme.orange }}>
                      Manage all orders ›
                    </Link>
                  </div>

                  <div className="table-responsive">
                    <table className="table align-middle mb-0">
                      <thead>
                        <tr style={{ background: "#fffaf6" }}>
                          <th className="small text-secondary">ORDER</th>
                          <th className="small text-secondary">CUSTOMER</th>
                          <th className="small text-secondary">DATE</th>
                          <th className="small text-secondary">TOTAL</th>
                          <th className="small text-secondary">STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...orders].reverse().slice(0, 5).map((o) => {
                          const badge = getStatusBadge(o.status);
                          return (
                            <tr key={o.id}>
                              <td className="fw-bold small" style={{ color: theme.ink }}>#{o.id}</td>
                              <td className="small fw-semibold">{o.shippingName}</td>
                              <td className="small text-muted">{o.createdAt}</td>
                              <td className="small fw-bold" style={{ color: theme.orange }}>${Number(o.total || 0).toFixed(2)}</td>
                              <td>
                                <span className="badge rounded-pill" style={{ color: badge.color, background: badge.background, fontSize: 10, padding: "5px 10px" }}>
                                  {o.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan="5" className="text-center py-4 text-muted small">No orders yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="p-4 bg-white h-100 d-flex flex-column" style={cardStyle}>
                  <div className="mb-3">
                    <span style={kickerStyle}>POPULAR MENU</span>
                    <h3 className="fw-bolder mt-1 mb-0" style={{ ...headingFont, fontSize: 18 }}>Featured Products</h3>
                    <p className="small text-muted mb-0">Các món trà sữa tiêu biểu</p>
                  </div>

                  <div className="d-flex flex-column gap-3 my-auto">
                    {products.filter((p) => p.isPopular).slice(0, 4).map((p) => (
                      <div key={p.id} className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ background: "#fffaf6", border: "1px solid #f6eee5" }}>
                        <div className="d-flex align-items-center gap-3 min-width-0">
                          <img src={p.image} alt={p.name} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8 }} />
                          <div className="text-truncate">
                            <strong className="d-block text-truncate small" style={{ color: theme.ink, maxWidth: 130 }}>{p.name}</strong>
                            <span className="small text-muted" style={{ fontSize: 11 }}>★ {p.rating} · {p.category}</span>
                          </div>
                        </div>
                        <strong className="small" style={{ color: theme.orange }}>${Number(p.price || 0).toFixed(2)}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;