import path from "node:path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pkg from "webpack";

const { DefinePlugin } = pkg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
  target: "node",
  mode: "production",
  entry: path.resolve(__dirname, "./src", "index"),
  module: {
    rules: [{ test: /\.ts$/i, use: "ts-loader" }],
  },
  resolve: {
    extensions: [".ts"],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "./dist"),
  },
  plugins: [
    new DefinePlugin({ "process.env": JSON.stringify(dotenv.config().parsed) }),
  ],
};

export default config;
