import { dbServerPort, ERROR_MESSAGE, host } from "../const";
import { User } from "../types";
import getValidUser from "../utils/get-valid-user";

const handlePostRequest = async (req: {
  method: string;
  url: string;
  data?: string;
}) => {
  let validUser: User | null = null;

  try {
    const user: unknown = JSON.parse(req.data as string);
    validUser = getValidUser(user);

    if (validUser) {
      await fetch(`http://${host}:${dbServerPort}/users`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(validUser),
      });
      return { statusCode: 201, data: { user: validUser } };
    } else {
      return { statusCode: 400, data: ERROR_MESSAGE.invalidData };
    }
  } catch (error) {
    if (error instanceof SyntaxError)
      return { statusCode: 400, data: ERROR_MESSAGE.invalidJson };
    return { statusCode: 500, data: ERROR_MESSAGE.unknownError };
  }
};

export default handlePostRequest;
