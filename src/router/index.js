const bookRouter = require("./book.js"),
    categoryRouter = require("./category.js"),
    userRouter = require("./user.js"),
    orderRouter = require("./order.js"),
    ratingRouter = require("./rating.js");

const router = (app) => {
    app.use("/api/book", bookRouter);
    app.use("/api/user", userRouter);
    app.use("/api/order", orderRouter);
    app.use("/api/rating", ratingRouter);
    app.use("/api/category", categoryRouter);
};

module.exports = router;
