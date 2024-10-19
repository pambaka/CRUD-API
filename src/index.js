import http from "node:http";
import { endpoint, ERROR_MESSAGE } from "./const.js";
import handleGetRequest from "./handle-get-request.js";

const host = "localhost";
const port = 8080;

const requestListener = (req, res) => {
  res.setHeader("Content-type", "application/json");

  if (req.url.startsWith(endpoint)) {
    switch (req.method) {
      case "GET":
        handleGetRequest(req, res);
        break;
      default:
        res.writeHead(400);
        res.end(JSON.stringify({ message: ERROR_MESSAGE.unsupportedMethod }));
        break;
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ message: ERROR_MESSAGE.noExistEndpoint }));
  }
};

const server = http.createServer(requestListener);
server.listen(port, host, () =>
  console.log(`Server is running on http://${host}:${port}`)
);
