import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createCategory,
  getCategoryById,
  updateCategory,
} from "../../services/categoryService";

const CategoryCreate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    if (id) fetchCategory();
  }, []);

  const fetchCategory = async () => {
    const res = await getCategoryById(id);
    setName(res.data.data.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        const update = await updateCategory(id, { name });
        toast.success(
          update?.data?.message || "Category updated successfully!",
        );
      } else {
        const create = await createCategory({ name });
        toast.success(
          create?.data?.message || "Category created successfully!",
        );
      }

      navigate("/categories");
    } catch (error) {
      if (error?.response?.data?.errors) {
        error.response.data.errors.forEach((err) => {
          toast.error(err.msg);
        });
      } else {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Something went wrong!";

        toast.error(message);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h3>{id ? "Edit Category" : "Create Category"}</h3>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/categories")}
        >
          Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            className="form-control w-50 mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-success">{id ? "Update" : "Create"}</button>
      </form>
    </div>
  );
};

export default CategoryCreate;
