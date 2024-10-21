import http from "node:http";
import { fallbackPort, host } from "./const";
import requestListener from "./request-listener";
import dotenv from "dotenv";

dotenv.config();

const envPort = parseInt(process.env.SERVER_PORT ?? "");
const port = envPort ? envPort : fallbackPort;

const server = http.createServer(requestListener);
server.listen(port, host, () =>
  console.log(`Server is running on http://${host}:${port}`)
);

process.on("uncaughtException", (error) => {
  if (error instanceof Error) console.error(error.message);
});
