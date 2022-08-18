import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import hashed from 'src/utils/hashed';
import { RefreshDto } from './dto/refresh.dto';
import { SignCredentialDto } from './dto/sign-credential.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(signCredentialDto: SignCredentialDto) {
    try {
      const { name, uniqueCode } = signCredentialDto;
      const hashCode = await hashed.generate(uniqueCode);

      const existUser = await this.prismaService.user.findUnique({
        where: { name },
      });
      if (existUser) {
        return { message: 'name that already exist' };
      }

      await this.prismaService.user.create({
        data: {
          uniqueCode: hashCode,
          name,
        },
      });
      return { message: 'success' };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async signIn(signCredentialDto: SignCredentialDto) {
    const { name, uniqueCode } = signCredentialDto;
    const existUser = await this.prismaService.user.findUnique({
      where: { name },
    });
    if (
      existUser &&
      (await hashed.compare(uniqueCode.toString(), existUser.uniqueCode))
    ) {
      const accessToken = await this.getAccessToken(existUser.id);
      const refreshToken = await this.getRefreshToken(existUser.id);
      await this.updateRefreshToken(refreshToken, existUser.name);
      const user = {
        id: existUser.id,
        name: existUser.name,
        role: existUser.role,
      };
      return {
        accessToken,
        refreshToken,
        user,
      };
    } else {
      throw new NotFoundException();
    }
  }

  async signOut(username: string) {
    await this.updateRefreshToken(null, username);
  }

  async getAccessToken(id: number) {
    return this.jwtService.sign(
      { id },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: +process.env.JWT_ACCESS_EXPIRATION_TIME,
      },
    );
  }

  async getRefreshToken(id: number) {
    return this.jwtService.sign(
      { id },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: +process.env.JWT_REFRESH_EXPIRATION_TIME,
      },
    );
  }

  async updateRefreshToken(refreshToken: string | null, username: string) {
    let hashedRefreshToken: string;
    if (refreshToken) {
      hashedRefreshToken = await hashed.generate(refreshToken);
    } else {
      hashedRefreshToken = refreshToken;
    }

    await this.prismaService.user.update({
      where: { name: username },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async isRefreshTokenMatches(body: RefreshDto, username: string) {
    const existUser = await this.prismaService.user.findUnique({
      where: { name: username },
    });

    const isRefreshTokenMatching = await hashed.compare(
      body.refreshToken,
      existUser.refreshToken,
    );
    console.log(isRefreshTokenMatching);

    if (isRefreshTokenMatching) {
      const accessToken = await this.getAccessToken(existUser.id);
      return { accessToken };
    } else {
      throw new UnauthorizedException();
    }
  }
}
