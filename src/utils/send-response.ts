import { ServerResponse } from "node:http";
import { User } from "../types";

const sendResponse = (
  res: ServerResponse,
  status: number,
  data: string | Record<string, User | User[]>
) => {
  res.writeHead(status);

  const isMessage =
    String(status).startsWith("4") || String(status).startsWith("5");

  const resBody = isMessage ? { message: data } : data;

  res.end(JSON.stringify(resBody));
};

export default sendResponse;
