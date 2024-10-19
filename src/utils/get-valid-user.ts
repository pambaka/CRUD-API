import { User } from "../types";
import crypto from "node:crypto";

const getValidUser: (user: unknown) => User | null = (user) => {
  if (
    user &&
    typeof user === "object" &&
    "username" in user &&
    typeof user.username === "string" &&
    "age" in user &&
    typeof user.age === "number" &&
    "hobbies" in user &&
    Array.isArray(user.hobbies) &&
    user.hobbies.length !== 0 &&
    user.hobbies.every((hobby) => hobby && typeof hobby === "string")
  )
    return {
      id: crypto.randomUUID(),
      username: user.username,
      age: user.age,
      hobbies: user.hobbies,
    };

  return null;
};

export default getValidUser;
