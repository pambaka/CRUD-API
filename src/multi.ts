import cluster from "node:cluster";
import os from "node:os";
import http, { IncomingMessage, ServerResponse } from "node:http";
import { fallbackPort, host } from "./const";
// import { workers } from "./cluster";
import requestHandler from "./request-handler";
import sendResponse from "./utils/send-response";
import { User } from "./types";
import dotenv from "dotenv";

dotenv.config();

const envPort = parseInt(process.env.SERVER_PORT ?? "");
const port = envPort ? envPort : fallbackPort;

const cpuNumber = os.availableParallelism();

let currentWorkerId = 0;

if (cluster.isPrimary) {
  const workers: import("cluster").Worker[] = [];

  const requestListener = async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader("Content-type", "application/json");

    workers[currentWorkerId].send({
      url: req.url as string,
      method: req.method,
    });

    workers[currentWorkerId].on(
      "message",
      (workerRes: {
        statusCode: number;
        data: string | { string: User | User[] };
      }) => {
        sendResponse(res, workerRes.statusCode, workerRes.data);
        workers[currentWorkerId].removeAllListeners();
      }
    );

    if (currentWorkerId < cpuNumber - 2) currentWorkerId += 1;
    else currentWorkerId = 0;
  };

  const server = http.createServer(requestListener);
  server.listen({ host, port }, () => {
    console.log(
      `Primary (${process.pid}) server is running on http://${host}:${port}`
    );
  });

  for (let i = 0; i < cpuNumber - 1; i += 1) {
    workers.push(cluster.fork());
  }
} else if (cluster.isWorker) {
  const workerServerPort = port + (cluster.worker?.id ?? 0);

  const workerServer = http.createServer();
  workerServer.listen({ host, port: workerServerPort }, () => {
    console.log(
      `Worker (${cluster.worker?.process.pid}) server is running on http://${host}:${workerServerPort}`
    );
  });

  process.on("message", (req: { url: string; method: string }) => {
    console.log(
      `Worker ${cluster.worker?.process.pid} is processing ${req.method} request`
    );

    if (process.send)
      process.send(requestHandler({ method: req.method, url: req.url }));
  });
}

process.on("uncaughtException", (error) => {
  if (error instanceof Error) console.error(error.message);
});
