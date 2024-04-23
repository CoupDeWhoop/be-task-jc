const app = require("./app.js");
const { PORT = 9090 } = process.env;

app.listen(PORT, (err) => {
  console.log(`Listening on ${PORT}...`);
});
