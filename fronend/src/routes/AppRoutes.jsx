import { Route, Routes } from "react-router-dom";
import CategoryCreate from "../pages/categories/categoryCreate";
import CategoryList from "../pages/categories/categoryList";
import ProductCreate from "../pages/products/productCreate";
import ProductList from "../pages/products/productList";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/products/create" element={<ProductCreate />} />
      <Route path="/products/edit/:id" element={<ProductCreate />} />
      {/* <Route path="/products/view/:id" element={<ProductView />} /> */}

      <Route path="/categories" element={<CategoryList />} />
      <Route path="/categories/create" element={<CategoryCreate />} />
      <Route path="/categories/edit/:id" element={<CategoryCreate />} />
    </Routes>
  );
};

export default AppRoutes;
