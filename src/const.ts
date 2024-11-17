export const host = "127.0.0.1";
export const fallbackPort = 8080;

export const endpoint = "/api/users";

export const endpointRE = new RegExp(/^(\/api\/users)[\/]{0,1}[\?]{0,1}$/i);

export const ERROR_MESSAGE = {
  invalidData: "Invalid user data format",
  invalidJson: "Wrong JSON format",
  invalidUuid: "Invalid User ID format",
  noExistEndpoint: "Endpoint doesn't exist",
  unknownError: "Something went wrong",
  unsupportedMethod: "Unsupported method",
  userNotFound: (userId: string) => `User with ID ${userId} is not found`,
};

export const dbServerPort = 3333;
