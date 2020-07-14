import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  ForbiddenException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./users.entity";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller("user")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Query() query?: User): Promise<User[]> {
    if (query.password) {
      throw new ForbiddenException("Query parameter used is not allowed!");
    }
    const users = this.usersService.findAll(query);
    return users;
  }

  @Post()
  async create(@Body() createUser: User): Promise<User> {
    const createdUser = this.usersService.create(createUser);
    return createdUser;
  }
}
