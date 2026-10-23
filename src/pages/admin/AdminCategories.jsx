import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchData = () => {
    axios.get("http://localhost:3001/categories").then((res) => setCategories(res.data));
    axios.get("http://localhost:3001/products").then((res) => setProducts(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.patch(`http://localhost:3001/categories/${editingId}`, { name, description });
    } else {
      await axios.post("http://localhost:3001/categories", { name, description });
    }
    setName("");
    setDescription("");
    setEditingId(null);
    fetchData();
  };

  const handleDelete = async (cat) => {
    const isDependent = products.some((p) => p.category === cat.name);
    if (isDependent) {
      alert("Cannot delete this category because products are linked to it!");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    await axios.delete(`http://localhost:3001/categories/${cat.id}`);
    fetchData();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-milk-tea">Category Management</h2>
        <Link to="/admin" className="btn btn-outline-secondary">Back to Dashboard</Link>
      </div>

      <form onSubmit={handleSave} className="card card-custom p-4 shadow-sm mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              required
              className="form-control"
              placeholder="Category Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              required
              className="form-control"
              placeholder="Short Description *"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="col-md-2 d-grid">
            <button type="submit" className="btn btn-milk-tea">
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </form>

      <div className="card card-custom p-4 shadow-sm">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td className="fw-bold">{cat.name}</td>
                <td>{cat.description}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(cat.id);
                        setName(cat.name);
                        setDescription(cat.description);
                      }}
                      className="btn btn-warning btn-sm"
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(cat)} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories;