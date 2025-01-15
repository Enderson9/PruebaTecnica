import {Module} from '@nestjs/common';
import {ConexionModule} from 'src/conexion/conexion.module';
import {TarjetaService} from './tarjeta.service';
import { TarjetaController } from './tarjeta.controller';
import { LogsModule } from 'src/logger/logger.module';

@Module({
    imports: [ConexionModule, LogsModule],
    providers: [TarjetaService],
    controllers: [TarjetaController],
})
export class TarjetaModule {}
