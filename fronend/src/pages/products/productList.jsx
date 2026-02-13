import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmationModal from "../../components/models/ConfirmationModal";
import { getProducts, updateProduct } from "../../services/productService";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts({ page, search });
      setProducts(res.data.data);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  };

  // Open modal
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    await updateProduct(selectedId, { isDeleted: true });
    setShowModal(false);
    fetchProducts();
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h3>Products</h3>
        <Link to="/products/create" className="btn btn-primary">
          Add Product
        </Link>
      </div>

      <input
        type="text"
        className="form-control mb-3 w-25"
        placeholder="Search product..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <table className="table table-bordered table-hover rounded">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Categories</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center py-4">
                <div className="spinner-border" role="status" />
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No products found
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.categories?.map((c) => c.name).join(", ")}</td>
                <td>
                  <Link
                    to={`/products/edit/${product._id}`}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteClick(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-end gap-2 align-items-center">
        <button
          className="btn btn-secondary"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span>
          Page {pagination.currentPage || 1} of {pagination.totalPages || 1}
        </span>

        <button
          className="btn btn-secondary"
          disabled={page === pagination.totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
      />
    </div>
  );
};

export default ProductList;
