/* Main Entry */
// Import the libraries and files
const http = require("http");
const PORT = 4200;
const app = require("./app");


const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`App is running at the port ${PORT}...`);
});
