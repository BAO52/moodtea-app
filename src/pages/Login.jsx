import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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

      localStorage.setItem("user", JSON.stringify(safeUser));

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
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <div className="card card-custom p-4 shadow-sm">
        <h3 className="fw-bold text-milk-tea text-center mb-4">Login to MoodTea</h3>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              required
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              required
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-milk-tea w-100 py-2 fw-bold">
            Login
          </button>
        </form>

        <div className="mt-4 p-3 bg-light rounded-3 small">
          <div className="fw-bold mb-1">Demo Accounts:</div>
          <div>Customer: <code>customer@example.com</code> / <code>123456</code></div>
          <div>Admin: <code>admin@example.com</code> / <code>123456</code></div>
        </div>
      </div>
    </div>
  );
};

export default Login;