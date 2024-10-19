import http from "node:http";
import { ENDPOINTS } from "./const.js";

const host = "localhost";
const port = 8080;

const requestListener = (req, res) => {
  const endpoint = req.url;

  if (endpoint === `/${ENDPOINTS.users}`) {
    res.setHeader("Content-type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify({ users: {} }));
  } else {
    res.writeHead(404);
    res.end("Endpoint doesn't exist");
  }
};

const server = http.createServer(requestListener);
server.listen(port, host, () =>
  console.log(`Server is running on http://${host}:${port}`)
);
