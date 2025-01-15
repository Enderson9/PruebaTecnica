import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseInterceptors } from "@nestjs/common";
import { TarjetaService } from "./tarjeta.service";
import { TarjetaDto } from "./dto/tarjeta.dto";
import { ApiBody, ApiOperation } from "@nestjs/swagger";
import { LoggingInterceptor } from "src/interceptors/logging.interceptor";

@Controller('tarjeta')
@UseInterceptors(LoggingInterceptor)
export class TarjetaController{
    constructor(private tarjetaService: TarjetaService){}

    @Get('listar')
    @ApiOperation({summary: 'Permite obtener todos los registros ingresados'})
    async Listar(){
        return await this.tarjetaService.listar();
    }

    @Post('crear')
    @ApiOperation({summary: 'Permite crear un nuevo registro'})
    @ApiBody({type: TarjetaDto})
    async Crear(@Body() dto: TarjetaDto){
       return await this.tarjetaService.create(dto);
    }

    @Put('actualizar')
    @ApiOperation({summary: 'Permite actualizar un registro existente'})
    @ApiBody({type: TarjetaDto})
    async Actualizar(@Body() dto: TarjetaDto){
       return await this.tarjetaService.actualizar(dto);
    }

    @Delete('eliminar/:tarj_Id/:usuario')
    @ApiOperation({summary: 'Permite eliminar un registro existente'})
    async Eliminar(@Param('tarj_Id', ParseIntPipe) tarj_Id: number, @Param('usuario') usuario: string){
        return await this.tarjetaService.eliminar(tarj_Id, usuario);
    }
}