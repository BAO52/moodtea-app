import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/users").then((res) => {
      setCustomers(res.data.filter((u) => u.role === "Customer"));
    });
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-milk-tea">Customer Management</h2>
        <Link to="/admin" className="btn btn-outline-secondary">Back to Dashboard</Link>
      </div>

      <div className="card card-custom p-4 shadow-sm">
        <div className="mb-3" style={{ maxWidth: "350px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="table align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td className="fw-bold">{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>
                  <button
                    onClick={() => setSelectedCustomer(c)}
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

      {selectedCustomer && (
        <div className="card card-custom p-4 shadow-sm mt-4">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
            <h5 className="fw-bold mb-0">Customer Information</h5>
            <button onClick={() => setSelectedCustomer(null)} className="btn btn-sm btn-close" />
          </div>
          <p className="mb-1"><strong>ID:</strong> {selectedCustomer.id}</p>
          <p className="mb-1"><strong>Name:</strong> {selectedCustomer.name}</p>
          <p className="mb-1"><strong>Email:</strong> {selectedCustomer.email}</p>
          <p className="mb-1"><strong>Phone:</strong> {selectedCustomer.phone}</p>
          <p className="mb-0"><strong>Address:</strong> {selectedCustomer.address}</p>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;