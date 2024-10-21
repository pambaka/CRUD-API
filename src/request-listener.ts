import { IncomingMessage, ServerResponse } from "http";
import getEndpointFromRequest from "./utils/get-endpoint-from-request";
import { endpoint, endpointRE, ERROR_MESSAGE } from "./const";
import handleGetRequest from "./handle-get-request";
import handlePostRequest from "./handle-post-request";
import sendResponse from "./utils/send-response";
import handlePutRequest from "./handle-put-request";
import handleDeleteRequest from "./handle-delete-request";

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader("Content-type", "application/json");

  const urlEndpoint = getEndpointFromRequest(req.url!);
  const pathFragments = urlEndpoint.split("/");

  if (
    urlEndpoint.startsWith(endpoint) &&
    (pathFragments.length < 5 || !pathFragments[4])
  ) {
    switch (req.method) {
      case "GET":
        handleGetRequest(req, res);
        break;
      case "POST":
        if (endpointRE.test(urlEndpoint)) handlePostRequest(req, res);
        else sendResponse(res, 404, ERROR_MESSAGE.noExistEndpoint);
        break;
      case "PUT":
        handlePutRequest(req, res);
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

export default requestListener;
