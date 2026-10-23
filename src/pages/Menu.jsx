import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMood, setSelectedMood] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    axios.get("http://localhost:3001/products").then((res) => {
      setProducts(res.data.filter((p) => p.status === "Active"));
    });
    axios.get("http://localhost:3001/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  const filteredProducts = products
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => selectedCategory === "All" || item.category === selectedCategory)
    .filter((item) => selectedMood === "All" || item.mood === selectedMood)
    .filter((item) => {
      if (priceRange === "under5") return item.price < 5;
      if (priceRange === "5andAbove") return item.price >= 5;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-milk-tea text-center mb-4">Our Menu</h2>

      <div className="card card-custom p-3 mb-4 shadow-sm">
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search drinks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
            >
              <option value="All">All Moods</option>
              <option value="Happy">Happy</option>
              <option value="Relax">Relax</option>
              <option value="Focus">Focus</option>
              <option value="Energetic">Energetic</option>
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="All">All Prices</option>
              <option value="under5">Under $5.00</option>
              <option value="5andAbove">$5.00 & Above</option>
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort By: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="alert alert-warning text-center">No drinks found matching your criteria.</div>
      ) : (
        <div className="row g-4">
          {filteredProducts.map((item) => (
            <div className="col-12 col-sm-6 col-md-4" key={item.id}>
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;