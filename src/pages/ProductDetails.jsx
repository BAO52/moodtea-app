import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("M");
  const [sugar, setSugar] = useState("100%");
  const [ice, setIce] = useState("100%");
  const [topping, setTopping] = useState("None");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to add items to your cart!");
      navigate("/login");
      return;
    }

    const cartRes = await axios.get(`http://localhost:3001/cart?userId=${user.id}`);
    const existingItem = cartRes.data.find(
      (item) =>
        item.productId === product.id &&
        item.size === size &&
        item.topping === topping
    );

    if (existingItem) {
      await axios.patch(`http://localhost:3001/cart/${existingItem.id}`, {
        quantity: existingItem.quantity + Number(quantity),
      });
    } else {
      await axios.post("http://localhost:3001/cart", {
        userId: user.id,
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        size,
        sugar,
        ice,
        topping,
        quantity: Number(quantity),
      });
    }

    alert("Added to cart successfully!");
    navigate("/cart");
  };

  if (!product) {
    return <div className="container mt-5 text-center">Loading product details...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card card-custom p-4 shadow-sm">
        <div className="row g-4 align-items-center">
          <div className="col-md-5">
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid rounded-4 w-100"
              style={{ maxHeight: "380px", objectFit: "cover" }}
            />
          </div>

          <div className="col-md-7">
            <div className="d-flex gap-2 mb-2">
              <span className="badge badge-mood">{product.mood}</span>
              <span className="badge badge-category">{product.category}</span>
            </div>

            <h2 className="fw-bold text-milk-tea">{product.name}</h2>
            <p className="text-muted">{product.description}</p>
            <h3 className="fw-bold text-milk-tea mb-3">${Number(product.price).toFixed(2)}</h3>

            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <label className="form-label fw-semibold">Size</label>
                <select className="form-select" value={size} onChange={(e) => setSize(e.target.value)}>
                  <option value="M">Medium (M)</option>
                  <option value="L">Large (L)</option>
                </select>
              </div>

              <div className="col-sm-6">
                <label className="form-label fw-semibold">Topping</label>
                <select className="form-select" value={topping} onChange={(e) => setTopping(e.target.value)}>
                  <option value="None">No Topping</option>
                  <option value="Black Pearl">Black Pearl</option>
                  <option value="White Pearl">White Pearl</option>
                  <option value="Cheese Foam">Cheese Foam</option>
                  <option value="Egg Pudding">Egg Pudding</option>
                </select>
              </div>

              <div className="col-sm-4">
                <label className="form-label fw-semibold">Sugar Level</label>
                <select className="form-select" value={sugar} onChange={(e) => setSugar(e.target.value)}>
                  <option value="100%">100% Sugar</option>
                  <option value="70%">70% Sugar</option>
                  <option value="50%">50% Sugar</option>
                  <option value="0%">0% Sugar</option>
                </select>
              </div>

              <div className="col-sm-4">
                <label className="form-label fw-semibold">Ice Level</label>
                <select className="form-select" value={ice} onChange={(e) => setIce(e.target.value)}>
                  <option value="100%">100% Ice</option>
                  <option value="50%">50% Ice</option>
                  <option value="0%">No Ice</option>
                </select>
              </div>

              <div className="col-sm-4">
                <label className="form-label fw-semibold">Quantity</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>

            <button onClick={handleAddToCart} className="btn btn-milk-tea px-5 py-2 fw-bold">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;