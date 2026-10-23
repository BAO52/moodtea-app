import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Milk Tea");
  const [mood, setMood] = useState("Happy");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  const [viewProduct, setViewProduct] = useState(null);

  const fetchProducts = () => {
    axios.get("http://localhost:3001/products").then((res) => setProducts(res.data));
  };

  useEffect(() => {
    fetchProducts();
    axios.get("http://localhost:3001/categories").then((res) => setCategories(res.data));
  }, []);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (Number(price) <= 0) {
      alert("Price must be greater than 0!");
      return;
    }

    const payload = {
      name,
      price: Number(price),
      category,
      mood,
      image,
      description,
      status,
      rating: 4.8,
      isPopular: false,
      isNew: true,
    };

    if (editingId) {
      await axios.patch(`http://localhost:3001/products/${editingId}`, payload);
    } else {
      await axios.post("http://localhost:3001/products", payload);
    }

    resetForm();
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setMood(product.mood);
    setImage(product.image);
    setDescription(product.description);
    setStatus(product.status);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    await axios.delete(`http://localhost:3001/products/${id}`);
    fetchProducts();
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPrice("");
    setCategory("Milk Tea");
    setMood("Happy");
    setImage("");
    setDescription("");
    setStatus("Active");
    setShowForm(false);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-milk-tea">Product Management</h2>
        <div className="d-flex gap-2">
          <Link to="/admin" className="btn btn-outline-secondary">Back to Dashboard</Link>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn btn-milk-tea"
          >
            + Add Product
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSaveProduct} className="card card-custom p-4 shadow-sm mb-4">
          <h5 className="fw-bold mb-3">{editingId ? "Edit Product" : "Add New Product"}</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Product Name *</label>
              <input
                type="text"
                required
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Category *</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Mood *</label>
              <select className="form-select" value={mood} onChange={(e) => setMood(e.target.value)}>
                <option value="Happy">Happy</option>
                <option value="Relax">Relax</option>
                <option value="Focus">Focus</option>
                <option value="Energetic">Energetic</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Status *</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Image URL *</label>
              <input
                type="text"
                required
                className="form-control"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Description *</label>
              <textarea
                required
                className="form-control"
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="col-12 d-flex gap-2">
              <button type="submit" className="btn btn-milk-tea px-4">Save</button>
              <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </form>
      )}

      <div className="card card-custom p-4 shadow-sm">
        <div className="mb-3" style={{ maxWidth: "350px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search product by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="rounded-3"
                      style={{ width: "55px", height: "55px", objectFit: "cover" }}
                    />
                  </td>
                  <td className="fw-bold">{p.name}</td>
                  <td>{p.category}</td>
                  <td>${Number(p.price).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${p.status === "Active" ? "bg-success" : "bg-danger"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button onClick={() => setViewProduct(p)} className="btn btn-info btn-sm text-white">
                        View
                      </button>
                      <button onClick={() => handleEdit(p)} className="btn btn-warning btn-sm">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="btn btn-danger btn-sm">
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

      {viewProduct && (
        <div className="card card-custom p-4 shadow-sm mt-4">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
            <h5 className="fw-bold mb-0">Product Details: {viewProduct.name}</h5>
            <button onClick={() => setViewProduct(null)} className="btn btn-sm btn-close" />
          </div>
          <div className="row align-items-center">
            <div className="col-md-4">
              <img src={viewProduct.image} alt={viewProduct.name} className="img-fluid rounded-3" />
            </div>
            <div className="col-md-8">
              <p><strong>Name:</strong> {viewProduct.name}</p>
              <p><strong>Category:</strong> {viewProduct.category}</p>
              <p><strong>Mood:</strong> {viewProduct.mood}</p>
              <p><strong>Price:</strong> ${Number(viewProduct.price).toFixed(2)}</p>
              <p><strong>Status:</strong> {viewProduct.status}</p>
              <p><strong>Description:</strong> {viewProduct.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;