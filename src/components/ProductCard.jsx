import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="card card-custom h-100 shadow-sm p-3 d-flex flex-column justify-content-between">
      <div>
        <img
          src={product.image}
          alt={product.name}
          className="card-img-top rounded-3 mb-3"
          style={{ height: "200px", objectFit: "cover" }}
        />
        <div className="d-flex justify-content-between mb-2">
          <span className="badge badge-mood rounded-pill px-2 py-1">
            Mood: {product.mood}
          </span>
          <span className="badge badge-category rounded-pill px-2 py-1">
            {product.category}
          </span>
        </div>
        <h5 className="card-title fw-bold text-milk-tea">{product.name}</h5>
        <p className="card-text text-muted small">{product.description}</p>
      </div>

      <div className="pt-3 border-top mt-3 d-flex justify-content-between align-items-center">
        <div>
          <span className="fs-5 fw-bold text-milk-tea">${Number(product.price).toFixed(2)}</span>
          <span className="ms-2 small text-warning">★ {product.rating || 4.8}</span>
        </div>
        <Link to={`/products/${product.id}`} className="btn btn-milk-tea btn-sm px-3">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;