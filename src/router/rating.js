const ratingRouter = require('express').Router();
const { isAdmin, verifyToken } = require('../middlewares/authMiddleware.js');
const ratingController = require('../controllers/RatingController.js');

ratingRouter.post("/", verifyToken, ratingController.rating);

ratingRouter.get("/:bookId", ratingController.getRatings);

ratingRouter.post("/reply/:ratingId", verifyToken, ratingController.ratingReply);
ratingRouter.get("/reply/:ratingId", ratingController.getReplies);

ratingRouter.patch("/update", verifyToken, ratingController.updateRating);

ratingRouter.delete("/:ratingId", verifyToken, ratingController.deleteRating);

module.exports = ratingRouter;