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

    if (!name.trim()) {
      setError("Name cannot be empty!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    if (password !== password.trim()) {
      setError("Password cannot start or end with spaces!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const cleanEmail = email.trim();

      const res = await axios.get("http://localhost:3001/users");

      const existingUser = res.data.find(
        (u) => u.email.toLowerCase() === cleanEmail.toLowerCase()
      );

      if (existingUser) {
        setError("Email already exists!");
        return;
      }

      await axios.post("http://localhost:3001/users", {
        name: name.trim(),
        email: cleanEmail,
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
    <div className="container-fluid min-vh-100 bg-light d-flex justify-content-center align-items-center py-4">
      <div
        className="card shadow-sm border rounded-3 w-100"
        style={{ maxWidth: "450px" }}
      >
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark text-nowrap">
              Create MoodTea Account
            </h2>
            <p className="text-secondary mb-0">Please enter your details</p>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          {success && <div className="alert alert-success py-2">{success}</div>}

          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>

              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Confirm Password</label>

              <input
                type="password"
                className="form-control"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold py-2"
            >
              Sign Up
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-secondary">Already have an account? </span>

            <Link
              to="/login"
              className="text-primary fw-semibold text-decoration-none"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
