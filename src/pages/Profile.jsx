import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(savedUser?.name || "");
  const [phone, setPhone] = useState(savedUser?.phone || "");
  const [address, setAddress] = useState(savedUser?.address || "");

  const handleUpdate = async (e) => {
    e.preventDefault();

    await axios.patch(`http://localhost:3001/users/${savedUser.id}`, {
      name,
      phone,
      address,
    });

    const updatedUser = { ...savedUser, name, phone, address };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Profile updated successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: "500px" }}>
      <div className="card card-custom p-4 shadow-sm rounded-4">
        <div className="text-center mb-4">
          <h3 className="fw-bold text-milk-tea mb-2">My Profile</h3>
          <p className="text-muted small mb-0">
            Manage and update your personal information.
          </p>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              disabled
              className="form-control bg-light"
              value={savedUser?.email || ""}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Phone Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-milk-tea flex-grow-1 fw-semibold"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-outline-danger fw-semibold"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
