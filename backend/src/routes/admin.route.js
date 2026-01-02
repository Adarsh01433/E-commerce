import {Router} from "express"
import { createProducts, getAllCustomers, getAllOrders, getAllProducts, getDashboardStats, updateOrderStatus, updateProducts } from '../controllers/admin.controller.js'
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js";

const router  = Router();

// optimization -DRY
router.use(protectRoute, adminOnly);

router.post("/products", upload.array("images",3),createProducts);
router.get("/products", getAllProducts);
router.put("/products/:id",upload.array("images", 3), updateProducts);

router.get("/orders", getAllOrders)
router.patch("/orders/:orderId/status", updateOrderStatus)

router.get("/customers", getAllCustomers)

router.get("/stats", getDashboardStats)

export default router  