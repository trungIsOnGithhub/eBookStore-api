const bookRouter = require('express').Router();
const bookController = require('../controllers/BookController.js');
const { isAdmin, verifyToken } = require('../middlewares/authMiddleware.js');

bookRouter.get('/get', bookController.getBooks);
bookRouter.get('/get/:id', bookController.getBookById);

bookRouter.post('/create',
    verifyToken,
    isAdmin,
    bookController.addBook
);
bookRouter.post('/search', bookController.searchBooks);

bookRouter.delete('/delete/:id', verifyToken, isAdmin, bookController.deleteBook);

bookRouter.patch('/update', verifyToken, isAdmin, bookController.updateBook);

module.exports = bookRouter;
