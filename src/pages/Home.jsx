import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedMood, setSelectedMood] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/products")
      .then((res) => {
        setProducts(res.data.filter((item) => item.status === "Active"));
      })
      .catch((err) => console.error(err));
  }, []);

  const moodProducts = products
    .filter((item) => selectedMood === "All" || item.mood === selectedMood)
    .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const popularDrinks = products.filter((item) => item.isPopular);
  const newArrivals = products.filter((item) => item.isNew);

  return (
    <div className="container mt-4">
      <div className="p-5 mb-5 rounded-4 bg-milk-tea text-white shadow">
        <div className="row align-items-center">
          <div className="col-md-7">
            <span className="badge badge-mood mb-2 px-3 py-2">ONLINE MILK TEA SHOP</span>
            <h1 className="display-5 fw-bold">Your Mood, Your Tea</h1>
            <p className="lead">
              Discover refreshing milk teas and fruit teas tailored to how you feel today.
            </p>
            <div className="d-flex gap-2 mt-3">
              <input
                type="text"
                className="form-control w-50"
                placeholder="Quick search drink..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Link to="/menu" className="btn btn-pastel-pink px-4 d-flex align-items-center">
                Order Now
              </Link>
            </div>
          </div>
          <div className="col-md-5 text-center mt-4 mt-md-0">
            <img
              src="https://images.unsplash.com/photo-1558857563-b371033873b8?w=500&auto=format&fit=crop&q=60"
              alt="Hero Banner"
              className="img-fluid rounded-4 shadow"
              style={{ maxHeight: "260px", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

      <div className="text-center mb-5">
        <h3 className="fw-bold text-milk-tea mb-3">Choose Drink By Your Mood</h3>
        <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
          {["All", "Happy", "Relax", "Focus", "Energetic"].map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`btn px-4 py-2 rounded-pill fw-semibold ${
                selectedMood === mood ? "btn-milk-tea" : "btn-outline-secondary"
              }`}
            >
              {mood}
            </button>
          ))}
        </div>

        <div className="row g-4 text-start">
          {moodProducts.map((item) => (
            <div className="col-12 col-sm-6 col-md-4" key={item.id}>
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <h3 className="fw-bold text-milk-tea mb-3">Popular Drinks</h3>
        <div className="row g-4">
          {popularDrinks.map((item) => (
            <div className="col-12 col-sm-6 col-md-4" key={item.id}>
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <h3 className="fw-bold text-milk-tea mb-3">New Arrivals</h3>
        <div className="row g-4">
          {newArrivals.map((item) => (
            <div className="col-12 col-sm-6 col-md-4" key={item.id}>
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;