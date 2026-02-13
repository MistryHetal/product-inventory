import express from "express";
import controller from "../controllers/category.controller.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
const router = express.Router();

router.post("/", controller.createCategory);
router.get("/", controller.getCategories);
router.get("/:id", validateObjectId, controller.getCategoryById);
router.put("/:id", validateObjectId, controller.updateCategory);

export default router;
