import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./users.entity";
import { UpdateResult, DeleteResult } from "typeorm";
import { Bcrypt } from "../auth/bcrypt";
import { QueryUserParams } from "./dto/query-user.dto";

@Injectable()
export class UsersService {
  private readonly users: User[];
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async findAll(query: QueryUserParams): Promise<User[]> {
    return query
      ? await this.usersRepository.find({ where: { ...query } })
      : await this.usersRepository.find();
  }

  async findWithPassword(email: string): Promise<User> {
    const user = this.usersRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("email = :email", { email })
      .getOne();
    return user;
  }

  async create(user: User): Promise<User> {
    try {
      //const userExist = await this.findAll({ email: user.email });
      user.password = await Bcrypt.hash(user.password);

      const createdUser = await this.usersRepository.save(user);
      delete createdUser.password;
      return createdUser;
    } catch (error) {
      console.log(error);
    }
  }

  async update(user: User): Promise<UpdateResult> {
    return await this.usersRepository.update(user.id, user);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }
}
