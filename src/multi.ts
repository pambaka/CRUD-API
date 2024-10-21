import cluster from "node:cluster";
import os from "node:os";
import http from "node:http";
import { fallbackPort, host } from "./const";
import requestListener from "./request-listener";
import dotenv from "dotenv";

dotenv.config();

const envPort = parseInt(process.env.SERVER_PORT ?? "");
const port = envPort ? envPort : fallbackPort;

const cpuNumber = os.availableParallelism();

if (cluster.isPrimary) {
  const server = http.createServer(requestListener);
  server.listen({ host, port }, () => {
    console.log(
      `Primary (${process.pid}) server is running on http://${host}:${port}`
    );
  });

  for (let i = 0; i < cpuNumber - 1; i += 1) {
    cluster.fork();
  }
} else {
  const workerServerPort = port + (cluster.worker?.id ?? 0);

  const workerServer = http.createServer(requestListener);
  workerServer.listen({ host, port: workerServerPort }, () => {
    console.log(
      `Worker (${cluster.worker?.process.pid}) server is running on http://${host}:${workerServerPort}`
    );
  });
}

process.on("uncaughtException", (error) => {
  if (error instanceof Error) console.error(error.message);
});
