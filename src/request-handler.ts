import { endpoint, ERROR_MESSAGE } from "./const";
import handleGetRequest from "./multi/handle-get-request";
import getEndpointFromRequest from "./utils/get-endpoint-from-request";

const requestHandler = (req: { method: string; url: string }) => {
  const urlEndpoint = getEndpointFromRequest(req.url);
  const pathFragments = urlEndpoint.split("/");

  if (
    urlEndpoint.startsWith(endpoint) &&
    (pathFragments.length < 5 || !pathFragments[4])
  ) {
    switch (req.method) {
      case "GET":
        return handleGetRequest(req);
      //   case "POST":
      //     if (endpointRE.test(urlEndpoint)) handlePostRequest(req, res);
      //     else sendResponse(res, 404, ERROR_MESSAGE.noExistEndpoint);
      //     break;
      //   case "PUT":
      //     handlePutRequest(req, res);
      //     break;
      //   case "DELETE":
      //     handleDeleteRequest(req, res);
      //     break;
      default:
        return { statusCode: 400, data: ERROR_MESSAGE.unsupportedMethod };
    }
  } else {
    return { statusCode: 404, data: ERROR_MESSAGE.noExistEndpoint };
  }
};

export default requestHandler;
