import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [SettingService, PrismaService],
  controllers: [SettingController],
})
export class SettingModule {}
