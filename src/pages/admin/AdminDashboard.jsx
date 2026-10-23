import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios.get("http://localhost:3001/products").then((res) => setProducts(res.data));
    axios.get("http://localhost:3001/orders").then((res) => setOrders(res.data));
  }, []);

  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="container-fluid mt-4 px-4">
      <div className="row g-4">
        <div className="col-md-3 col-lg-2">
          <div className="card bg-milk-tea text-white p-3 rounded-4 shadow-sm">
            <h5 className="fw-bold border-bottom pb-2 mb-3">Admin Panel</h5>
            <div className="nav flex-column gap-2">
              <Link to="/admin" className="btn btn-light text-start fw-bold">Dashboard</Link>
              <Link to="/admin/products" className="btn btn-outline-light text-start">Products</Link>
              <Link to="/admin/categories" className="btn btn-outline-light text-start">Categories</Link>
              <Link to="/admin/orders" className="btn btn-outline-light text-start">Orders</Link>
              <Link to="/admin/customers" className="btn btn-outline-light text-start">Customers</Link>
              <button onClick={handleLogout} className="btn btn-danger text-start mt-3">Logout</button>
            </div>
          </div>
        </div>

        <div className="col-md-9 col-lg-10">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-milk-tea mb-0">Admin Dashboard</h2>
            <span className="fw-semibold">Admin: {user?.name}</span>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <div className="card card-custom p-3 shadow-sm">
                <div className="text-muted small">Total Products</div>
                <h3 className="fw-bold text-milk-tea mb-0">{products.length}</h3>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card card-custom p-3 shadow-sm">
                <div className="text-muted small">Total Orders</div>
                <h3 className="fw-bold text-milk-tea mb-0">{orders.length}</h3>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card card-custom p-3 shadow-sm">
                <div className="text-muted small">Pending Orders</div>
                <h3 className="fw-bold text-danger mb-0">{pendingOrders}</h3>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card card-custom p-3 shadow-sm">
                <div className="text-muted small">Total Revenue</div>
                <h3 className="fw-bold text-success mb-0">${totalRevenue.toFixed(2)}</h3>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card card-custom p-4 shadow-sm">
                <h5 className="fw-bold mb-3">Recent Orders</h5>
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id}>
                        <td className="fw-bold">#{o.id}</td>
                        <td>{o.shippingName}</td>
                        <td>{o.createdAt}</td>
                        <td>${Number(o.total).toFixed(2)}</td>
                        <td><span className="badge bg-secondary">{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card card-custom p-4 shadow-sm">
                <h5 className="fw-bold mb-3">Featured Products</h5>
                <ul className="list-group list-group-flush">
                  {products.slice(0, 4).map((p) => (
                    <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                      <span>{p.name}</span>
                      <span className="fw-bold">${Number(p.price).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;