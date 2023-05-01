// Node Modules
require("dotenv").config();
const bodyParser = require("body-parser");

// File Modules
const connection = require('./config/connection.js')
const router = require("./router/index.js");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware.js");

const app = require('express')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(notFound);
app.use(errorHandler);

router(app);

// app.use(notFound);
// app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connection.getMongoose()
    .then(() => {
        app.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`) );
    })
    .catch(error => console.log(`Server could not listen: ${error}`));