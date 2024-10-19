import { IncomingMessage, ServerResponse } from "node:http";
import { User } from "./types";
import getValidUser from "./utils/get-valid-user";
import users from "./users";
import sendResponse from "./utils/send-response";

const handlePostRequest = (req: IncomingMessage, res: ServerResponse) => {
  let validUser: User | null = null;

  let data = "";
  req.on("data", (chunk: Buffer) => {
    data += chunk.toString();
  });

  req.on("close", () => {
    try {
      const user: unknown = JSON.parse(data);
      validUser = getValidUser(user);

      if (validUser) {
        users.push(validUser);
        sendResponse(res, 201, { user: validUser });
      } else {
        sendResponse(res, 400, "Invalid user data");
      }
    } catch (error) {
      if (error instanceof SyntaxError)
        sendResponse(res, 400, "Wrong JSON format");
      else sendResponse(res, 500, "Something went wrong");
    }
  });
};

export default handlePostRequest;
