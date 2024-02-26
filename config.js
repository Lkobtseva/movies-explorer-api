const { JWT_SECRET = "JWT_SECRET" } = process.env;
const { MONGO_URL = "mongodb://127.0.0.1:27017/bitfilmsdb" } = process.env;
module.exports = {
  JWT_SECRET,
  MONGO_URL,
};
