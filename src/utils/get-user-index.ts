import users from "../users";

const getUserIndex = (userId: string) => {
  const index = users.map((user) => user.id).indexOf(userId);

  return index === -1 ? null : index;
};

export default getUserIndex;
