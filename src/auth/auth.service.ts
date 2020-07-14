import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { Bcrypt } from "../auth/bcrypt";
import { LoginUserDto } from "../users/dto/login-user.dto";
import { JwtUserPayload } from "src/users/dto/jwtpayload-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(userReq: LoginUserDto): Promise<any> {
    const user = await this.usersService.findWithPassword(userReq.email);
    if (user) {
      const checkPassword = await Bcrypt.compare(
        userReq.password,
        user.password
      );
      if (checkPassword) {
        delete user.password;
        return user;
      } else throw new UnauthorizedException("Email or password invalid!");
    } else {
      throw new UnauthorizedException("Email not register, please signup!");
    }
  }

  async validateUserPayload(payload: JwtUserPayload): Promise<any> {
    const user = await this.usersService.findAll({ email: payload.email });
    if (user) {
      return user;
    } else throw new UnauthorizedException("Token is not valid!");
  }

  async login(user: LoginUserDto): Promise<any> {
    const payload = { email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
