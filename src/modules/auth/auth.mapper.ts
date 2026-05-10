import { IUser } from "../../types";

export const toUserResponse = (user: IUser) => {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
