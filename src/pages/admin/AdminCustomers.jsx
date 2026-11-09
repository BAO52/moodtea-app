import { useEffect, useState, useMemo } from "react";
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

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    axios
      .get(`${API_URL}/users`)
      .then((res) => setCustomers(res.data.filter((u) => u.role === "Customer")))
      .catch(console.error);

    axios.get(`${API_URL}/orders`).then((res) => setOrders(res.data)).catch(console.error);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  const getCustomerStats = (userId) => {
    const userOrders = orders.filter((o) => o.userId === userId);
    const totalSpent = userOrders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + Number(o.total || 0), 0);
    return { orderCount: userOrders.length, totalSpent };
  };

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.phone?.includes(term)
    );
  }, [customers, search]);

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
                <Link to="/admin/orders" className="btn text-start" style={{ color: "#444", borderRadius: 10, fontSize: 13, border: "none" }}>
                  Orders
                </Link>
                <Link
                  to="/admin/customers"
                  className="btn text-start fw-bold"
                  style={{ background: "#fff2e5", color: theme.orange, borderRadius: 10, fontSize: 13, border: "none" }}
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

          {/* Nội dung danh sách khách hàng */}
          <div className="col-md-9 col-lg-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span style={kickerStyle}>USER MANAGEMENT</span>
                <h1 className="mt-1 mb-0" style={sectionTitle}>Customer Accounts</h1>
              </div>
            </div>

            <div className="p-4 bg-white" style={cardStyle}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                  <h3 className="fw-bolder mb-1" style={{ ...headingFont, fontSize: 18 }}>
                    All Customers
                    <span className="badge rounded-pill ms-2" style={{ background: "#fff0e5", color: theme.orange, fontSize: 11 }}>
                      {customers.length}
                    </span>
                  </h3>
                  <p className="mb-0 small text-muted">Danh sách tài khoản khách hàng</p>
                </div>

                <div className="input-group" style={{ maxWidth: 350 }}>
                  <span className="input-group-text bg-white border-end-0" style={{ borderColor: theme.line }}>⌕</span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    style={{ borderColor: theme.line, fontSize: 12 }}
                    placeholder="Search by name, email, phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr style={{ background: "#fffaf6" }}>
                      <th className="small text-secondary">CUSTOMER</th>
                      <th className="small text-secondary">CONTACT</th>
                      <th className="small text-secondary">ORDERS</th>
                      <th className="small text-secondary">TOTAL SPENT</th>
                      <th className="small text-secondary">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((c) => {
                      const stats = getCustomerStats(c.id);
                      return (
                        <tr key={c.id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                style={{ width: 38, height: 38, background: "#fff0e5", color: theme.orange, fontSize: 13 }}
                              >
                                {c.name ? c.name.charAt(0).toUpperCase() : "U"}
                              </div>
                              <div>
                                <strong className="d-block small" style={{ color: theme.ink }}>{c.name}</strong>
                                <small className="text-muted" style={{ fontSize: 11 }}>ID: #{c.id}</small>
                              </div>
                            </div>
                          </td>
                          <td className="small">
                            <div>{c.email}</div>
                            <small className="text-muted">{c.phone || "No phone provided"}</small>
                          </td>
                          <td>
                            <span className="badge rounded-pill px-3 py-1" style={{ background: "#f4f4f6", color: theme.ink, fontSize: 11 }}>
                              {stats.orderCount} orders
                            </span>
                          </td>
                          <td className="small fw-bold" style={{ color: theme.orange }}>
                            ${stats.totalSpent.toFixed(2)}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm py-1 px-3"
                              style={{ background: "#fff4e7", color: "#bd762d", borderRadius: 8, fontSize: 11, fontWeight: 700 }}
                              onClick={() => setSelectedCustomer(c)}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredCustomers.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-muted small">No customers found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup Chi Tiết Khách Hàng */}
      {selectedCustomer && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ zIndex: 100, background: "rgba(24,22,20,.48)" }}
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="bg-white rounded-4 shadow-lg p-4 w-100 position-relative"
            style={{ maxWidth: 460 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3"
              style={{ width: 32, height: 32, padding: 0 }}
              onClick={() => setSelectedCustomer(null)}
            >
              ×
            </button>
            <span style={kickerStyle}>CUSTOMER PROFILE</span>
            <h3 className="fw-bolder mt-1 mb-3" style={headingFont}>{selectedCustomer.name}</h3>

            <div className="d-flex flex-column gap-2 mb-4">
              <div className="d-flex justify-content-between py-2 border-bottom small">
                <span className="text-muted">Customer ID</span>
                <strong style={{ color: theme.ink }}>#{selectedCustomer.id}</strong>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom small">
                <span className="text-muted">Email</span>
                <strong style={{ color: theme.ink }}>{selectedCustomer.email}</strong>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom small">
                <span className="text-muted">Phone Number</span>
                <strong style={{ color: theme.ink }}>{selectedCustomer.phone || "None"}</strong>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom small">
                <span className="text-muted">Delivery Address</span>
                <strong style={{ color: theme.ink }}>{selectedCustomer.address || "None"}</strong>
              </div>
            </div>

            <button type="button" className="btn w-100 text-white" style={orangeButton} onClick={() => setSelectedCustomer(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;