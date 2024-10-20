import users from "../users";

const getUserIndex = (userId: string) => {
  return users.map((user) => user.id).indexOf(userId);
};

export default getUserIndex;
