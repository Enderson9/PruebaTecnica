import { Injectable, LoggerService } from '@nestjs/common';
import {createLogger, format, transports} from 'winston';
import * as fs from 'fs';
@Injectable()
export class AppLogger implements LoggerService {
    private readonly logger;

    constructor(){
        const logsDir = 'logs'; 

        if(!fs.existsSync(logsDir)){
            fs.mkdirSync(logsDir);
        }

        this.logger = createLogger({
            level: 'info',
            format: format.combine(
                format.timestamp(),
                format.json()
            ),
            transports: [
                new transports.File({
                    filename: `${logsDir}/usuario-acciones-${new Date().toISOString().split('T')[0]}.log`,
                }),
            ],
        });
    }

    log(usuario: string, message: string, context?: string){
        this.logger.info({usuario,message, context});
    }

    error(message: string, trace?: string, context?: string){
        this.logger.error({message, trace, context});
    }

    warn(message: string, context?: string){
        this.logger.warn({message, context});
    }

    debug(message: string, context?: string){
        this.logger.debug({message, context});
    }

    verbose(message: string, context?: string){
        this.logger.verbose({message, context});
    }
}
