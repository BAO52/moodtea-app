import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.get("http://localhost:3001/users");

      const foundUser = res.data.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        setError("Invalid email or password!");
        return;
      }

      const safeUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        phone: foundUser.phone || "",
        address: foundUser.address || "",
      };

      if (remember) {
        localStorage.setItem("user", JSON.stringify(safeUser));
        sessionStorage.removeItem("user");
      } else {
        sessionStorage.setItem("user", JSON.stringify(safeUser));
        localStorage.removeItem("user");
      }

      if (foundUser.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Failed to connect to server.");
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-light d-flex justify-content-center align-items-center py-4">
      <div
        className="card shadow-sm border rounded-3 w-100"
        style={{ maxWidth: "420px" }}
      >
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">Welcome MoodTea</h2>
            <p className="text-secondary mb-0">Please enter your details</p>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>

              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>

              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-check mb-4">
              <input
                type="checkbox"
                className="form-check-input"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />

              <label className="form-check-label" htmlFor="remember">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold py-2"
            >
              Sign In
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-secondary">Don't have an account? </span>

            <Link
              to="/register"
              className="text-primary fw-semibold text-decoration-none"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
