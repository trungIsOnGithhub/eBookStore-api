const mongoose = require("mongoose");

const mongooseOptions = {
	strictQuery: true,
	useNewUrlParser: true,
    useUnifiedTopology: true
}
// current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true }
// current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true }
    // .set("strictQuery", true)// `strictQuery` option will be switched back to `false` by default in Mongoose 7
function getMongoose() {
	return mongoose.connect(process.env.MONGO_URL, mongooseOptions);
}

module.exports = {
	getMongoose
};