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
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="card card-custom p-4 shadow-sm">
        <h3 className="fw-bold text-milk-tea mb-3">My Profile</h3>
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input type="text" disabled className="form-control" value={savedUser?.email || ""} />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              required
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Phone</label>
            <input
              type="text"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Address</label>
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-milk-tea flex-grow-1">
              Save Changes
            </button>
            <button type="button" onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;