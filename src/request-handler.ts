import { endpoint, endpointRE, ERROR_MESSAGE } from "./const";
import handleGetRequest from "./multi/handle-get-request";
import handlePostRequest from "./multi/handle-post-request";
import getEndpointFromRequest from "./utils/get-endpoint-from-request";

const requestHandler = async (req: {
  method: string;
  url: string;
  data?: string;
}) => {
  const urlEndpoint = getEndpointFromRequest(req.url);
  const pathFragments = urlEndpoint.split("/");

  if (
    urlEndpoint.startsWith(endpoint) &&
    (pathFragments.length < 5 || !pathFragments[4])
  ) {
    switch (req.method) {
      case "GET":
        return await handleGetRequest(req);
      case "POST":
        if (endpointRE.test(urlEndpoint)) return await handlePostRequest(req);
        return { statusCode: 404, data: ERROR_MESSAGE.noExistEndpoint };
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
