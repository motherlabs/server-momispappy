import { Injectable } from '@nestjs/common';
import { Setting } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SettingService {
  constructor(private prismaService: PrismaService) {}

  async findOneSetting() {
    return await this.prismaService.setting.findFirst();
  }

  async updateSetting(data: Setting) {
    const { id, isPoint, isPrice, point } = data;
    if (id === 1) {
      await this.prismaService.setting.update({
        where: { id },
        data: {
          id,
          isPoint,
          isPrice,
          point: +point,
        },
      });
    }
  }
}
