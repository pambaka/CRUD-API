import { IncomingMessage, ServerResponse } from "node:http";
import { endpoint } from "./const";
import users from "./users";
import isValidUuid from "./utils/is-valid-uuid";

const handleGetRequest = (req: IncomingMessage, res: ServerResponse) => {
  const urlEndpoint = req.url!;

  if (urlEndpoint === endpoint) {
    res.writeHead(200);
    res.end(JSON.stringify({ users }));
  } else {
    const urlFragments = urlEndpoint.split("/");
    const userId = urlFragments[3];

    if (!isValidUuid(userId)) {
      res.writeHead(400);
      res.end(JSON.stringify({ message: "Invalid user id format" }));
    } else if (users[users.map((user) => user.id).indexOf(userId)]) {
      res.writeHead(200);
      res.end(
        JSON.stringify({
          user: users[users.map((user) => user.id).indexOf(userId)],
        })
      );
    } else {
      res.writeHead(404);
      res.end(
        JSON.stringify({ message: `User with id ${userId} is not found` })
      );
    }
  }
};

export default handleGetRequest;
