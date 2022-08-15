import {
  Body,
  ConsoleLogger,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RefreshDto } from './dto/refresh.dto';
import { SignCredentialDto } from './dto/sign-credential.dto';
import { jwtRefreshGuard } from './jwt-refresh.guard';
import { jwtGuard } from './jwt.guard';

@ApiTags('인증 API')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '토큰인증' })
  async auth(@Res() res, @Req() req) {
    console.log('at');
    const user = {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role,
    };
    res.status(HttpStatus.OK).send({ user: user });
  }

  @Post('/signUp')
  @ApiOperation({ summary: '회원가입' })
  async signUp(
    @Body() signCredentialDto: SignCredentialDto,
  ): Promise<{ message: string }> {
    return this.authService.signUp(signCredentialDto);
  }

  @Post('/signIn')
  @ApiOperation({ summary: '로그인' })
  async signIn(@Body() signCredentialDto: SignCredentialDto) {
    console.log('login');
    return this.authService.signIn(signCredentialDto);
  }

  @Post('/signOut')
  @UseGuards(jwtGuard)
  @ApiOperation({ summary: '로그아웃' })
  @ApiBearerAuth('accessToken')
  async signOut(@Req() req) {
    return this.authService.signOut(req.user.name);
  }

  @Post('/refresh')
  @UseGuards(jwtRefreshGuard)
  @ApiOperation({ summary: '리프레시토큰 인증' })
  async isRefreshToken(@Body() body: RefreshDto, @Req() req) {
    console.log('rt');
    return this.authService.isRefreshTokenMatches(body, req.user.name);
  }
}
