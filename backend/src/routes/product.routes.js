import express from "express";
import controller from "../controllers/product.contoller.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
const router = express.Router();

router.post("/", controller.createProduct);
router.get("/", controller.getProducts);
router.get("/:id", validateObjectId, controller.getProductById);
router.put("/:id", validateObjectId, controller.updateProduct);

const productRouter = router;
export default productRouter;
