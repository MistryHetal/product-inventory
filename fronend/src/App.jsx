import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Navbar />
      <div className="container mt-4">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
