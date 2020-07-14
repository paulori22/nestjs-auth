import { genSalt, hash, compare } from "bcrypt";

export class Bcrypt {
  private static saltRounds = 10;

  static async hash(password: string): Promise<string> {
    const salt = await genSalt(this.saltRounds);

    const hashPassword = await hash(password, salt);
    return hashPassword;
  }
  static async compare(
    password: string,
    hashPassword: string
  ): Promise<boolean> {
    const result = await compare(password, hashPassword);
    return result;
  }
}
