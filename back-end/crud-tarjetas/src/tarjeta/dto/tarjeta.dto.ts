import { ApiProperty } from "@nestjs/swagger";
export class TarjetaDto{
    @ApiProperty({description: 'Variable para manejar el Id', example: 1})
    tarj_Id?: number;

    @ApiProperty({description: 'Variable para manejar el nombre', example: 'Tarjeta 1'})
    tarj_Titulo: string;

    @ApiProperty({description: 'Arreglo para manejar las descripciones', example: 'Descripcion 1, Descripcion 2, etc.'})
    tarj_Descripciones: string[];
    
    @ApiProperty({description: 'Variable para manejar la fecha de creacion', example: '2025-01-13'})
    tarj_FechaCreacion: Date;

    @ApiProperty({description: 'Variable para manejar el nombre del usuario', example: 'Admin'})
    usuario: string;
}