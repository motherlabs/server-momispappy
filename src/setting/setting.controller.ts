import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Setting } from '@prisma/client';
import { jwtGuard } from 'src/auth/jwt.guard';
import { SettingService } from './setting.service';

@ApiTags('상품 설정 API')
@Controller('setting')
export class SettingController {
  constructor(private settingService: SettingService) {}

  @Get('/')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '설정 GET API' })
  async findOneSetting() {
    return this.settingService.findOneSetting();
  }

  @Put('/')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('aceessToken')
  @ApiOperation({ summary: '설정 셋팅 API' })
  async updateSetting(@Body() data: Setting, @Req() req) {
    if (req.user.role === 'ADMIN') {
      return this.settingService.updateSetting(data);
    }
  }
}
