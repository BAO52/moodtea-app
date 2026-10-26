import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.get("http://localhost:3001/users");
      const existingUser = res.data.find((u) => u.email === email);

      if (existingUser) {
        setError("Email already exists!");
        return;
      }

      await axios.post("http://localhost:3001/users", {
        name,
        email,
        password,
        role: "Customer",
        phone: "",
        address: "",
      });

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Failed to connect to server.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <div className="card card-custom p-4 shadow-sm">
        <h3 className="fw-bold text-milk-tea text-center mb-4">Create Account</h3>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {success && <div className="alert alert-success py-2">{success}</div>}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input
              type="password"
              required
              className="form-control"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-milk-tea w-100 py-2 fw-bold">
            Register
          </button>
        </form>

        <div className="text-center mt-3">
          <span className="text-muted">Already have an account? </span>
          <Link to="/login" className="text-milk-tea fw-semibold text-decoration-none">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
