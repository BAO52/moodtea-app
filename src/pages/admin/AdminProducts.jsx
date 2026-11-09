import { useEffect, useMemo, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
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

const containerStyle = {
  maxWidth: 1180,
};

const sectionTitle = {
  ...headingFont,
  fontSize: 24,
  fontWeight: 800,
  letterSpacing: "-.8px",
};

const kickerStyle = {
  color: "#c68a59",
  fontSize: 9,
  fontWeight: 800,
  letterSpacing: "1.5px",
};

const orangeButton = {
  background: theme.orange,
  color: "#fff",
  border: 0,
  borderRadius: 10,
  padding: "11px 20px",
  fontWeight: 700,
  fontSize: 12,
};

const cardStyle = {
  border: `1px solid ${theme.line}`,
  borderRadius: 14,
  overflow: "hidden",
  background: "#fff",
  boxShadow: "0 6px 20px rgba(30,30,40,.045)",
};

const fallbackImage =
  "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=85";

const AdminProducts = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      return null;
    }
  });

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
  const [deleteProduct, setDeleteProduct] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Cannot load products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();

    axios
      .get(`${API_URL}/categories`)
      .then((res) => {
        setCategories(res.data);

        if (res.data.length) {
          setCategory(res.data[0].name);
        }
      })
      .catch((error) => console.error("Cannot load categories:", error));
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPrice("");
    setCategory(categories[0]?.name || "Milk Tea");
    setMood("Happy");
    setImage("");
    setDescription("");
    setStatus("Active");
    setShowForm(false);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    if (Number(price) <= 0) {
      alert("Price must be greater than 0!");
      return;
    }

    const oldProduct = editingId
      ? products.find((product) => product.id === editingId)
      : null;

    const payload = {
      name,
      price: Number(price),
      category,
      mood,
      image,
      description,
      status,
      rating: oldProduct?.rating || 4.8,
      isPopular: oldProduct?.isPopular || false,
      isNew: editingId ? oldProduct?.isNew || false : true,
    };

    try {
      if (editingId) {
        await axios.patch(`${API_URL}/products/${editingId}`, payload);
      } else {
        await axios.post(`${API_URL}/products`, payload);
      }

      await fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Cannot save product:", error);
      alert("Something went wrong while saving the drink.");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setName(product.name || "");
    setPrice(product.price ?? "");
    setCategory(product.category || "Milk Tea");
    setMood(product.mood || "Happy");
    setImage(product.image || "");
    setDescription(product.description || "");
    setStatus(product.status || "Active");
    setShowForm(true);

    document
      .getElementById("product-management")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      await fetchProducts();

      if (viewProduct?.id === id) {
        setViewProduct(null);
      }

      setDeleteProduct(null);
    } catch (error) {
      console.error("Cannot delete product:", error);
      alert("Something went wrong while deleting the drink.");
    }
  };

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((product) =>
      (product.name || "").toLowerCase().includes(keyword)
    );
  }, [products, search]);

  const popularProducts = products
    .filter((product) => product.status === "Active")
    .slice(0, 4);

  const scrollToProducts = () => {
    document
      .getElementById("popular-drinks")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const formatPrice = (value) => `$${Number(value || 0).toFixed(2)}`;

  return (
    <div style={{ ...pageFont, minHeight: "100vh", background: "#fff" }}>
      <header
        className="sticky-top bg-white"
        style={{
          zIndex: 30,
          borderBottom: "1px solid #f2f2f2",
        }}
      >
        <div
          className="container d-flex align-items-center justify-content-between"
          style={{
            ...containerStyle,
            height: 80,
          }}
        >
          <a
            href="#home"
            className="text-decoration-none fw-bold"
            style={{
              color: theme.orange,
              ...headingFont,
              fontSize: 30,
              letterSpacing: "-1.5px",
              minWidth: 120,
            }}
          >
            MoodTea
          </a>

          <nav className="d-none d-lg-flex align-items-center gap-4 h-100">
            {[
              ["Home", "#home"],
              ["Our Drinks", "#popular-drinks"],
              ["Contact", "#footer"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-decoration-none d-flex align-items-center h-100"
                style={{
                  color: "#33333a",
                  fontSize: 11,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </a>
            ))}

            <Link
              to="/admin"
              className="text-decoration-none d-flex align-items-center h-100"
              style={{
                color: "#33333a",
                fontSize: 11,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              Dashboard
            </Link>
          </nav>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="d-flex align-items-center gap-2">
                <Link
                  to="/profile"
                  className="text-decoration-none fw-bold"
                  style={{
                    color: theme.ink,
                    fontSize: 11,
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.name || user.username || "Profile"}
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn text-white"
                  style={{
                    background: theme.orange,
                    borderRadius: 10,
                    padding: "11px 18px",
                    fontSize: 11,
                    fontWeight: 700,
                    marginLeft: 5,
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-decoration-none text-white text-center"
                style={{
                  background: theme.orange,
                  borderRadius: 10,
                  padding: "11px 23px",
                  fontSize: 11,
                  fontWeight: 700,
                  minWidth: 65,
                  marginLeft: 5,
                }}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        <section
          id="home"
          className="container py-4 py-lg-5"
          style={containerStyle}
        >
          <div
            className="row align-items-center g-4"
            style={{ minHeight: 430 }}
          >
            <div className="col-lg-6 py-3">
              <div
                className="d-inline-flex align-items-center gap-2 rounded-pill px-3 py-2 mb-4"
                style={{
                  background: "#fff2e6",
                  color: "#bd6b28",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                <span style={{ color: "#efa63c" }}>✦</span>
                Drinks happy, feel happy
              </div>

              <h1
                className="fw-bolder mb-3"
                style={{
                  ...headingFont,
                  fontSize: "clamp(40px, 5vw, 61px)",
                  lineHeight: 1.13,
                  letterSpacing: "-2.8px",
                }}
              >
                Your favorite drinks,
                <br />
                made with <span style={{ color: theme.orange }}>love.</span>
              </h1>

              <p
                className="mb-4"
                style={{
                  color: theme.muted,
                  fontSize: 14,
                  lineHeight: 1.8,
                  maxWidth: 390,
                }}
              >
                Discover your perfect drink, choose your mood, and order your
                favorite MoodTea creations anytime.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  scrollToProducts();
                }}
                className="d-flex align-items-center gap-2 p-2 ps-3 bg-white rounded-3"
                style={{
                  maxWidth: 450,
                  height: 58,
                  border: `1px solid ${theme.line}`,
                  boxShadow: "0 8px 25px rgba(30,30,40,.06)",
                }}
              >
                <span style={{ color: theme.orange, fontSize: 19 }}>⌕</span>

                <input
                  aria-label="Search drinks"
                  className="form-control border-0 shadow-none"
                  placeholder="Search your favorite drink..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ fontSize: 12, minWidth: 0 }}
                />

                <button
                  type="submit"
                  className="btn text-nowrap"
                  style={{
                    ...orangeButton,
                    padding: "13px 18px",
                    borderRadius: 9,
                  }}
                >
                  Find Drinks <span className="ms-2">→</span>
                </button>
              </form>

              <div
                className="d-flex align-items-center gap-3 mt-4"
                style={{ fontSize: 11, color: "#686873" }}
              >
                <div className="d-flex ps-1">
                  {["👩🏻", "👨🏽", "👩🏾", "👨🏻"].map((avatar, index) => (
                    <span
                      key={index}
                      className="rounded-circle d-flex align-items-center justify-content-center border border-2 border-white"
                      style={{
                        width: 29,
                        height: 29,
                        marginLeft: -4,
                        background: "#f7e5d7",
                        fontSize: 15,
                      }}
                    >
                      {avatar}
                    </span>
                  ))}
                </div>

                <span>
                  Join <strong style={{ color: theme.orange }}>10,000+</strong>{" "}
                  happy MoodTea lovers
                </span>
              </div>
            </div>

            <div className="col-lg-6">
              <div
                className="position-relative d-flex align-items-center justify-content-center mx-auto"
                style={{ height: 420, maxWidth: 480 }}
              >
                <div
                  className="position-absolute w-100 h-75"
                  style={{
                    background: "#fff0e4",
                    borderRadius: "48% 52% 44% 56% / 48% 42% 58% 52%",
                    transform: "rotate(-8deg)",
                  }}
                />

                <div
                  className="position-relative rounded-circle border border-4 border-white overflow-hidden shadow"
                  style={{ width: "min(410px, 92%)", aspectRatio: "1 / 1" }}
                >
                  <img
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                    src="https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=500&auto=format&fit=crop&q=60"
                    alt="Colorful milk tea drinks"
                  />
                </div>

                <span
                  className="position-absolute top-0 start-0"
                  style={{ color: theme.orange, fontSize: 35 }}
                >
                  ✳
                </span>

                <span
                  className="position-absolute bottom-0 end-0"
                  style={{ color: theme.orange, fontSize: 25 }}
                >
                  ✣
                </span>
              </div>
            </div>
          </div>
        </section>

        <section
          id="popular-drinks"
          className="container mb-5"
          style={containerStyle}
        >
          <div className="d-flex justify-content-between align-items-end mb-4 gap-3">
            <div>
              <span style={kickerStyle}>TASTY & REFRESHING</span>
              <h2 className="mt-2 mb-0" style={sectionTitle}>
                Popular Drinks
              </h2>
            </div>

            <button
              type="button"
              className="btn btn-link text-decoration-none fw-bold p-0 small"
              style={{ color: "#c77a3b" }}
              onClick={() =>
                document
                  .getElementById("product-management")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Manage drinks <span className="fs-5 ms-1">›</span>
            </button>
          </div>

          {popularProducts.length > 0 ? (
            <div className="row row-cols-2 row-cols-lg-4 g-3">
              {popularProducts.map((product) => (
                <div className="col" key={product.id}>
                  <article className="h-100" style={cardStyle}>
                    <div
                      className="position-relative overflow-hidden bg-light"
                      style={{ height: 290, width: "100%" }}
                    >
                      <img
                        src={product.image || fallbackImage}
                        alt={product.name}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                        onError={(e) => {
                          e.currentTarget.src = fallbackImage;
                        }}
                      />

                      {product.isNew && (
                        <span
                          className="badge position-absolute top-0 start-0 m-2"
                          style={{ background: theme.orange, fontSize: 8 }}
                        >
                          NEW
                        </span>
                      )}
                    </div>

                    <div className="p-3">
                      <div className="d-flex justify-content-between align-items-center gap-2">
                        <h3
                          className="fw-bold text-truncate mb-0"
                          style={{ fontSize: 13 }}
                        >
                          {product.name}
                        </h3>

                        <strong
                          className="text-nowrap"
                          style={{ color: "#e69a24", fontSize: 10 }}
                        >
                          ★ {Number(product.rating || 4.8).toFixed(1)}
                        </strong>
                      </div>

                      <p
                        className="my-2 text-truncate"
                        style={{ color: theme.muted, fontSize: 10 }}
                      >
                        {product.category || "Fresh drink"}
                        {product.mood ? ` · ${product.mood}` : ""}
                      </p>

                      <div
                        className="d-flex justify-content-between border-top pt-2"
                        style={{ color: theme.muted, fontSize: 9 }}
                      >
                        <span>◷ Freshly made</span>
                        <strong style={{ color: theme.orange }}>
                          {formatPrice(product.price)}
                        </strong>
                      </div>

                      <div className="d-flex gap-2 mt-3">
                        <button
                          type="button"
                          className="btn flex-fill py-2"
                          onClick={() => setViewProduct(product)}
                          style={{
                            border: "1px solid #f2d8c6",
                            background: "#fff9f4",
                            color: "#bd6b28",
                            borderRadius: 7,
                            fontSize: 9,
                            fontWeight: 700,
                          }}
                        >
                          View details
                        </button>

                        <button
                          type="button"
                          className="btn flex-fill py-2"
                          onClick={() => handleEdit(product)}
                          style={{
                            border: "1px solid #eee",
                            background: "#fff",
                            color: "#555",
                            borderRadius: 7,
                            fontSize: 9,
                            fontWeight: 700,
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="text-center p-5 rounded-4"
              style={{ background: "#fffaf6", color: theme.muted }}
            >
              <div style={{ fontSize: 35 }}>🧋</div>

              <h3 className="mt-2" style={{ color: theme.ink }}>
                No popular drinks yet
              </h3>

              <p className="small">
                Add an active drink in Product Management to display it here.
              </p>

              <button
                type="button"
                className="btn text-white"
                style={orangeButton}
                onClick={() => {
                  resetForm();
                  setShowForm(true);

                  document
                    .getElementById("product-management")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                + Add your first drink
              </button>
            </div>
          )}
        </section>

        <section
          id="product-management"
          className="container mb-5 p-3 p-md-4"
          style={{
            ...containerStyle,
            background: "#fffaf6",
            border: "1px solid #f6e9df",
            borderRadius: 19,
          }}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <div>
              <span style={kickerStyle}>ADMINISTRATION</span>

              <h2 className="mt-2 mb-0" style={sectionTitle}>
                Drink Management
              </h2>

              <p className="mb-0 mt-2 small" style={{ color: theme.muted }}>
                Manage the drinks displayed on your MoodTea page.
              </p>
            </div>

            <div className="d-flex align-items-center justify-content-between gap-3">
              <button
                type="button"
                className="btn text-white"
                style={orangeButton}
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                + Add Drink
              </button>
            </div>
          </div>

          {showForm && (
            <form
              onSubmit={handleSaveProduct}
              className="bg-white p-3 p-md-4 rounded-4 mb-3 shadow-sm"
              style={{ border: "1px solid #eee9e4" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <span style={kickerStyle}>DRINK DETAILS</span>

                  <h3
                    className="fw-bolder mt-1 mb-0"
                    style={{ ...headingFont, fontSize: 17 }}
                  >
                    {editingId ? "Edit Drink" : "Add New Drink"}
                  </h3>
                </div>

                <button
                  type="button"
                  className="btn rounded-circle"
                  onClick={resetForm}
                  style={{
                    background: "#f7f4f1",
                    width: 32,
                    height: 32,
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </div>

              <div className="row g-3">
                <div className="col-md-6 col-lg-4">
                  <label className="form-label small fw-bold">
                    Drink Name *
                  </label>

                  <input
                    className="form-control"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter drink name"
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label small fw-bold">
                    Price ($) *
                  </label>

                  <input
                    className="form-control"
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label small fw-bold">Category *</label>

                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}

                    {categories.length === 0 && (
                      <option value="Milk Tea">Milk Tea</option>
                    )}
                  </select>
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label small fw-bold">Mood *</label>

                  <select
                    className="form-select"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                  >
                    <option value="Happy">Happy</option>
                    <option value="Relax">Relax</option>
                    <option value="Focus">Focus</option>
                    <option value="Energetic">Energetic</option>
                  </select>
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label small fw-bold">Status *</label>

                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold">
                    Image URL *
                  </label>

                  <input
                    className="form-control"
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/drink.jpg"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold">
                    Description *
                  </label>

                  <textarea
                    className="form-control"
                    required
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe this drink..."
                  />
                </div>
              </div>

              <div className="d-flex gap-2 mt-4">
                <button
                  type="submit"
                  className="btn text-white"
                  style={orangeButton}
                >
                  {editingId ? "Save Changes" : "Create Drink"}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary fw-bold"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div
            className="bg-white rounded-4 p-3 p-md-4 shadow-sm"
            style={{ border: "1px solid #eee9e4" }}
          >
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
              <div>
                <h3
                  className="fw-bolder mb-1"
                  style={{ ...headingFont, fontSize: 17 }}
                >
                  All Drinks
                  <span
                    className="badge rounded-pill ms-1"
                    style={{
                      background: "#fff0e5",
                      color: theme.orange,
                      fontSize: 10,
                    }}
                  >
                    {products.length}
                  </span>
                </h3>

                <p
                  className="mb-0"
                  style={{ color: theme.muted, fontSize: 10 }}
                >
                  Search and manage your menu items
                </p>
              </div>

              <div
                className="input-group"
                style={{ width: 380, maxWidth: "100%" }}
              >
                <span className="input-group-text bg-white">⌕</span>

                <input
                  className="form-control"
                  type="text"
                  placeholder="Search drink by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ height: 38, fontSize: 12 }}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr style={{ background: "#fffaf6" }}>
                    <th className="small text-secondary">DRINK</th>
                    <th className="small text-secondary">CATEGORY</th>
                    <th className="small text-secondary">PRICE</th>
                    <th className="small text-secondary">STATUS</th>
                    <th className="small text-secondary">ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div
                          className="d-flex align-items-center gap-2"
                          style={{ minWidth: 190 }}
                        >
                          <img
                            src={product.image || fallbackImage}
                            alt={product.name}
                            onError={(e) => {
                              e.currentTarget.src = fallbackImage;
                            }}
                            style={{
                              width: 43,
                              height: 43,
                              objectFit: "cover",
                              borderRadius: 8,
                              background: "#f4f1ed",
                            }}
                          />

                          <div style={{ minWidth: 0 }}>
                            <strong
                              className="d-block"
                              style={{ color: "#292932", fontSize: 11 }}
                            >
                              {product.name}
                            </strong>

                            <small
                              className="d-block text-secondary text-truncate"
                              style={{ maxWidth: 210, fontSize: 9 }}
                            >
                              {product.description}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td className="small">{product.category}</td>

                      <td
                        className="fw-bold small"
                        style={{ color: "#d96b1f" }}
                      >
                        {formatPrice(product.price)}
                      </td>

                      <td>
                        <span
                          className="badge rounded-pill"
                          style={
                            product.status === "Active"
                              ? {
                                  color: "#27834b",
                                  background: "#eaf7ee",
                                  fontSize: 9,
                                }
                              : {
                                  color: "#c34d4d",
                                  background: "#fff0f0",
                                  fontSize: 9,
                                }
                          }
                        >
                          {product.status}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex gap-1">
                          <button
                            type="button"
                            className="btn btn-sm"
                            style={{
                              background: "#eef5ff",
                              color: "#3973bb",
                              fontSize: 9,
                            }}
                            onClick={() => setViewProduct(product)}
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm"
                            style={{
                              background: "#fff4e7",
                              color: "#bd762d",
                              fontSize: 9,
                            }}
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm"
                            style={{
                              background: "#fff0f0",
                              color: "#c44e4e",
                              fontSize: 9,
                            }}
                            onClick={() => setDeleteProduct(product)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center text-secondary py-4 small"
                      >
                        {search
                          ? "No drinks match your search."
                          : "No drinks found. Add your first drink."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <footer
        className="py-4 mt-5"
        id="footer"
        style={{
          background: "#20212a",
          color: "#fff",
        }}
      >
        <div className="container">
          <div className="row align-items-center gy-3">
            <div className="col-md-4 text-center text-md-start">
              <h6 className="fw-bold mb-0">MoodTea - Your Mood, Your Tea</h6>
            </div>

            <div className="col-md-4 text-center">
              <p className="small mb-0" style={{ color: "#a6a6af" }}>
                © 2026 MoodTea Online Store. All rights reserved.
              </p>
            </div>

            <div className="col-md-4 text-center text-md-end">
              <p
                className="small mb-1 d-flex align-items-center justify-content-md-end"
                style={{ color: "#e5e5e8" }}
              >
                <i
                  className="bi bi-geo-alt-fill me-2"
                  style={{ width: "18px" }}
                ></i>
                123 Main Street, Can Tho City
              </p>

              <p
                className="small mb-0 d-flex align-items-center justify-content-md-end"
                style={{ color: "#e5e5e8" }}
              >
                <i
                  className="bi bi-telephone-fill me-2"
                  style={{ width: "18px" }}
                ></i>
                Hotline: (+84) 901 234 567
              </p>
            </div>
          </div>
        </div>
      </footer>

      {viewProduct && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ zIndex: 100, background: "rgba(24,22,20,.48)" }}
          onClick={() => setViewProduct(null)}
        >
          <div
            className="position-relative bg-white rounded-4 overflow-auto shadow-lg w-100"
            style={{ maxWidth: 680, maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3"
              style={{ zIndex: 2, width: 32, height: 32, padding: 0 }}
              onClick={() => setViewProduct(null)}
            >
              ×
            </button>

            <div className="row g-0">
              <div className="col-md-6" style={{ minHeight: 380 }}>
                <img
                  src={viewProduct.image || fallbackImage}
                  alt={viewProduct.name}
                  className="w-100 h-100"
                  style={{
                    objectFit: "cover",
                    minHeight: 380,
                    width: "100%",
                  }}
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                />
              </div>

              <div className="col-md-6 p-4 p-md-5">
                <span style={kickerStyle}>DRINK DETAILS</span>

                <h2
                  className="fw-bolder mt-2 mb-2"
                  style={{ ...headingFont, fontSize: 24 }}
                >
                  {viewProduct.name}
                </h2>

                <div className="small fw-bold" style={{ color: "#e5a02d" }}>
                  ★ {Number(viewProduct.rating || 4.8).toFixed(1)}
                  <span className="text-secondary fw-normal">
                    {" "}
                    · {viewProduct.category}
                  </span>
                </div>

                <p
                  className="my-4 small"
                  style={{ color: theme.muted, lineHeight: 1.7 }}
                >
                  {viewProduct.description}
                </p>

                <div className="d-flex justify-content-between py-2 border-bottom small text-secondary">
                  <span>Mood</span>
                  <strong className="text-dark">{viewProduct.mood}</strong>
                </div>

                <div className="d-flex justify-content-between py-2 border-bottom small text-secondary">
                  <span>Status</span>
                  <strong className="text-dark">{viewProduct.status}</strong>
                </div>

                <div className="d-flex align-items-center justify-content-between gap-3 mt-4">
                  <strong className="fs-4" style={{ color: theme.orange }}>
                    {formatPrice(viewProduct.price)}
                  </strong>

                  <button
                    type="button"
                    className="btn text-white"
                    style={orangeButton}
                    onClick={() => {
                      handleEdit(viewProduct);
                      setViewProduct(null);
                    }}
                  >
                    Edit Drink
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteProduct && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{
            zIndex: 110,
            background: "rgba(24,22,20,.48)",
          }}
          onClick={() => setDeleteProduct(null)}
        >
          <div
            className="bg-white rounded-4 shadow-lg p-4 text-center"
            style={{ width: "100%", maxWidth: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: 55,
                height: 55,
                background: "#fff0f0",
                color: "#d9534f",
                fontSize: 25,
              }}
            >
              !
            </div>

            <h5 className="fw-bold mb-2">Delete Drink?</h5>

            <p className="small mb-4" style={{ color: theme.muted }}>
              Are you sure you want to delete{" "}
              <strong style={{ color: theme.ink }}>{deleteProduct.name}</strong>
              ? This action cannot be undone.
            </p>

            <div className="d-flex justify-content-center gap-2">
              <button
                type="button"
                className="btn fw-bold px-4"
                style={{
                  background: "#f5f5f5",
                  color: "#555",
                  borderRadius: 9,
                  fontSize: 12,
                }}
                onClick={() => setDeleteProduct(null)}
              >
                Keep Drink
              </button>

              <button
                type="button"
                className="btn text-white fw-bold px-4"
                style={{
                  background: "#dc4c4c",
                  borderRadius: 9,
                  fontSize: 12,
                }}
                onClick={() => handleDelete(deleteProduct.id)}
              >
                Delete Drink
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
