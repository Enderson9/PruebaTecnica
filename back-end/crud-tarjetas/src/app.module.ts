import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TarjetaModule } from './tarjeta/tarjeta.module';

@Module({
  imports: [TarjetaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
