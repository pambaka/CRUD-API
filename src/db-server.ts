import http, { IncomingMessage, ServerResponse } from "node:http";
import users from "./users";
import sendResponse from "./utils/send-response";
import getUserIndex from "./utils/get-user-index";
import { User } from "./types";
import { dbServerPort, ERROR_MESSAGE } from "./const";

const runDbServer = () => {
  const dbServer = http.createServer(
    (req: IncomingMessage, res: ServerResponse) => {
      res.setHeader("Content-type", "application/json");

      let data = "";
      req.on("data", (chunk) => {
        data += chunk.toString();
      });

      switch (req.method) {
        case "GET":
          // if (req.url === "/users") sendResponse(res, 200, { users });
          sendResponse(res, 200, { users });
          // else {
          //   const userId = req.url!.split("/")[2];
          //   const index = getUserIndex(userId as string);

          //   if (index >= 0) sendResponse(res, 200, { user: users[index] });
          //   else sendResponse(res, 404, ERROR_MESSAGE.userNotFound(userId));
          // }
          break;
        case "POST":
          req.on("close", () => {
            const user: User = JSON.parse(data);

            users.push(user);
            sendResponse(res, 200, { user: user });
          });
          break;
        default:
          sendResponse(res, 400, ERROR_MESSAGE.unsupportedMethod);
          break;
      }
    }
  );
  dbServer.listen({ port: dbServerPort });
};

export default runDbServer;
