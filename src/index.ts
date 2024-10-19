import http, { IncomingMessage, ServerResponse } from "node:http";
import { endpoint, ERROR_MESSAGE } from "./const";
import handleGetRequest from "./handle-get-request";
import handlePostRequest from "./handle-post-request";
import sendResponse from "./utils/send-response";
import handleDeleteRequest from "./handle-delete-request";

const host = "localhost";
const port = 8080;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader("Content-type", "application/json");

  if (req.url && req.url.startsWith(endpoint)) {
    switch (req.method) {
      case "GET":
        handleGetRequest(req, res);
        break;
      case "POST":
        if (req.url === endpoint) handlePostRequest(req, res);
        else sendResponse(res, 404, ERROR_MESSAGE.noExistEndpoint);
        break;
      case "DELETE":
        handleDeleteRequest(req, res);
        break;
      default:
        sendResponse(res, 400, ERROR_MESSAGE.unsupportedMethod);
        break;
    }
  } else {
    sendResponse(res, 404, ERROR_MESSAGE.noExistEndpoint);
  }
};

const server = http.createServer(requestListener);
server.listen(port, host, () =>
  console.log(`Server is running on http://${host}:${port}`)
);
