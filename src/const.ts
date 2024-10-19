export const endpoint = "/api/users";

export const ERROR_MESSAGE = {
  invalidUuid: "Invalid User ID format",
  noExistEndpoint: "Endpoint doesn't exist",
  unsupportedMethod: "Unsupported method",
  userNotFound: (userId: string) => `User with ID ${userId} is not found`,
};
