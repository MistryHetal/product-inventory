import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmationModal from "../../components/models/ConfirmationModal";
import { getCategories, updateCategory } from "../../services/categoryService";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      setCategories(res.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await updateCategory(selectedId, { isDeleted: true });
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h3>Categories</h3>
        <Link to="/categories/create" className="btn btn-primary">
          Add Category
        </Link>
      </div>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="2" className="text-center py-4">
                <div className="spinner-border" role="status" />
              </td>
            </tr>
          ) : categories.length === 0 ? (
            <tr>
              <td colSpan="2" className="text-center py-4 text-muted">
                No categories found
              </td>
            </tr>
          ) : (
            categories.map((cat) => (
              <tr key={cat._id}>
                <td>{cat.name}</td>
                <td>
                  <Link
                    to={`/categories/edit/${cat._id}`}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteClick(cat._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ConfirmationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
      />
    </div>
  );
};

export default CategoryList;
