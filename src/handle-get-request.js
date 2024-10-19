import { endpoint } from "./const.js";
import users from "./users.js";
import isValidUuid from "./utils/is-valid-uuid.js";

const handleGetRequest = (req, res) => {
  const urlEndpoint = req.url;

  if (urlEndpoint === endpoint) {
    res.writeHead(200);
    res.end(JSON.stringify({ users }));
  } else {
    const urlFragments = urlEndpoint.split("/");
    const userId = urlFragments[3];

    if (!isValidUuid(userId)) {
      res.writeHead(400);
      res.end(JSON.stringify({ message: "Invalid user id format" }));
    } else if (users[userId]) {
      res.writeHead(200);
      res.end(JSON.stringify({ user: users[userId] }));
    } else {
      res.writeHead(404);
      res.end(
        JSON.stringify({ message: `User with id ${userId} is not found` })
      );
    }
  }
};

export default handleGetRequest;
