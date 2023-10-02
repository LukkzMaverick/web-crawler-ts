import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CronModule } from './cron/cron.module';

@Module({
  imports: [CronModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
