import { Module } from "@nestjs/common";
import * as mysql from 'mysql2/promise';

@Module({
    providers: [
        {
            provide: 'MYSQL_CONNECTION',
            useFactory: async () => {
                return await mysql.createPool({
                    host: 'localhost',
                    user: 'root',
                    port: 3304,
                    password: 'Synxx',
                    database: 'dbpruebatecnica',
                });
            },
        },
    ],
    exports: ['MYSQL_CONNECTION'],
})
export class ConexionModule {}