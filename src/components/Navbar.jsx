import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-milk-tea px-4 py-3 shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          MoodTea
        </Link>

        <div className="d-flex align-items-center gap-3 flex-wrap">
          <Link className="nav-link text-white" to="/">Home</Link>
          <Link className="nav-link text-white" to="/menu">Menu</Link>

          {user && user.role === "Customer" && (
            <>
              <Link className="nav-link text-white" to="/my-orders">My Orders</Link>
              <Link className="btn btn-pastel-pink btn-sm px-3" to="/cart">
                Cart
              </Link>
            </>
          )}

          {user && user.role === "Admin" && (
            <Link className="btn btn-warning btn-sm fw-bold px-3" to="/admin">
              Admin Dashboard
            </Link>
          )}

          {user ? (
            <div className="d-flex align-items-center gap-2">
              <Link className="btn btn-outline-light btn-sm" to="/profile">
                Profile ({user.name})
              </Link>
              <button onClick={handleLogout} className="btn btn-danger btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <Link className="btn btn-light btn-sm fw-bold px-3" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;