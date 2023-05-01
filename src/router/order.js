const orderRouter = require('express').Router();
const orderController = require('../controllers/OrderController.js');
const { isAdmin, verifyToken } = require('../middlewares/authMiddleware.js');

orderRouter.post("/create", verifyToken, orderController.createOrder);

orderRouter.put(
    "/update-status",
    verifyToken,
    isAdmin,
    orderController.updateStatus
);

orderRouter.get("/", verifyToken, isAdmin, orderController.queryOrders);
orderRouter.get("/my-orders", verifyToken, orderController.queryMyOrders);
orderRouter.get("/:orderId", verifyToken, orderController.getOrderDetail);

module.exports = orderRouter;