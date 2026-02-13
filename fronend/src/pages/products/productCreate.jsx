import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getCategories } from "../../services/categoryService";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../services/productService";

const ProductCreate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    quantity: "",
    categories: [],
  });

  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (id) fetchProduct();
  }, []);

  const fetchCategories = async () => {
    const res = await getCategories();
    setAllCategories(res.data.data);
  };

  const fetchProduct = async () => {
    const res = await getProductById(id);
    setForm(res.data.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (o) => o.value);
    setForm({ ...form, categories: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        const update = await updateProduct(id, form);
        toast.success(update?.data?.message || "Product updated successfully!");
      } else {
        const create = await createProduct(form);
        toast.success(create?.data?.message || "Product created successfully!");
      }

      navigate("/");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong!";

      toast.error(message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h3>{id ? "Edit Product" : "Create Product"}</h3>
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Quantity</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Categories</label>
          <select
            multiple
            className="form-control"
            onChange={handleCategoryChange}
            value={form.categories}
          >
            {allCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-success">{id ? "Update" : "Create"}</button>
      </form>
    </div>
  );
};

export default ProductCreate;
