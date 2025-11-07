import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export type User = {
  id: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
};

const users: User[] = [];

export class UserModel {
  static findByUsername(username: string): User | undefined {
    return users.find((user) => user.username === username);
  }

  static async login(username: string, password: string): Promise<User | null> {
    const user = this.findByUsername(username);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  static async create(newUser: Omit<User, "id">): Promise<User> {
    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    const user: User = {
      id: uuidv4(),
      username: newUser.username,
      password: hashedPassword,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
    };

    users.push(user);
    return user;
  }
}
