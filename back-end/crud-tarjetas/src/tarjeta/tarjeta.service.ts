import { Injectable, Inject } from "@nestjs/common";
import { Pool } from "mysql2/promise";
import { AppLogger } from "src/logger/logger.service";
import { TarjetaDto } from "src/tarjeta/dto/tarjeta.dto";

@Injectable()
    export class TarjetaService{
        constructor(
            @Inject('MYSQL_CONNECTION') private connection: Pool,
            private logger: AppLogger
        ){}

        async listar(): Promise<any>{
            try{
                const [rows] = await this.connection.query('CALL SP_Tarjetas_Listar()');
                return rows[0];
            } catch (error){
                this.logger.error(
                    `Error al obtener las tarjetas: ${error.message}`,
                    error.stack,
                    `TarjetaService`,
                );
            }
            
        }

        async create(dto: TarjetaDto): Promise<any>{
            const connection = await this.connection.getConnection();
            try{
                await connection.beginTransaction();

                const sql = 'CALL SP_Tarjeta_Insertar(?, ?, ?)';
                const [result] = await connection.query(sql, [dto.tarj_Titulo, JSON.stringify(dto.tarj_Descripciones), new Date()]);
                const message = result[0][0]?.Message;
                
                await connection.commit();

                this.logger.log(
                    `${dto.usuario}`,
                    `Tarjeta creada: ${JSON.stringify(dto)}`,
                    `TarjetaService`
                );

                if(message === 'Error'){
                    return {codeStatus: 0, message: message}
                }else{
                    return {codeStatus: 1, message: message}
                }

            } catch (error){
                await connection.rollback();
                this.logger.error(
                    `Error al crear la tarjeta: ${error.message}`,
                    error.stack,
                    `TarjetaService`,
                );
            } finally{
                connection.release();
            }
        }

        async actualizar(dto: TarjetaDto): Promise<any>{
            const connection = await this.connection.getConnection();
            try{
                await connection.beginTransaction();

                const sql = 'CALL SP_Tarjeta_Actualizar(?, ?, ?)';
                const [result] = await connection.query(sql, [dto.tarj_Id, dto.tarj_Titulo, JSON.stringify(dto.tarj_Descripciones)]);
                const message = result[0][0]?.Message;

                await connection.commit();

                this.logger.log(
                    `${dto.usuario}`,
                    `Tarjeta actualizada: ${JSON.stringify(dto)}`,
                    `TarjetaService`,
                );

                if(message === 'Error'){
                    return {codeStatus: 0, message: message};
                }else{
                    return {codeStatus: 1, message: message};
                }

            } catch(error){
                await connection.rollback();
                this.logger.error(
                    `Error al actualizar la tarjeta: ${error.message}`,
                    error.stack,
                    `TarjetaService`,
                );
            } finally{
                connection.release();
            }
        }

        async eliminar(tarj_Id: number, usuario: string): Promise<any>{
            const connection = await this.connection.getConnection();
            try{
                await connection.beginTransaction();
                console.log('Id', tarj_Id)
                const sql = 'CALL SP_Tarjeta_Eliminar(?)';  
                const[result] = await connection.query(sql, tarj_Id);
                const message = result[0][0]?.Message;
                await connection.commit();
                
                this.logger.log(
                    `${usuario}`,
                    `Tarjeta con ID ${tarj_Id} eliminada`,
                    `TarjetaService`,
                );

                if(message === 'Exito'){
                    return {codeStatus: 1, message: message};
                }else{
                    return {codeStatus: 0, message: message};
                }

            } catch(error){
                await connection.rollback();
                console.log(error);
            } finally{
                connection.release();
            }
        }
    }