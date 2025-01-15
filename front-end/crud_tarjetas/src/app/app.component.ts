import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Toast } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TarjetaService } from './services/tarjeta.service';
import { HttpClientModule } from '@angular/common/http';
import { TarjetaModel } from './models/tarjeta.model';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { Table, TableModule } from 'primeng/table';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroup } from 'primeng/inputgroup';
import { FormsModule } from '@angular/forms';
import { SplitButton } from 'primeng/splitbutton';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CardModule,DialogModule,SplitButton,FormsModule,CommonModule,InputGroup,InputGroupAddonModule,InputIcon,InputTextModule,IconField, Toast, ButtonModule, HttpClientModule, TableModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MessageService, TarjetaService]
})
export class AppComponent implements OnInit {
  @ViewChild('pTable') pTable: Table;

  items: MenuItem[];
  tarjetasData: TarjetaModel[] = [];
  selectedCustomers!: TarjetaModel;
  descripciones: any[] = [];
  titulo: string = '';
  descripcion: string = '';
  formulario: boolean = false;
  validacionTitulo: boolean = false;
  accion: string = 'Nueva';
  validacionDescripcion: boolean = false;
  modalConfirmar: boolean = false;
  llenadoFila: any;
  constructor(
    private messageService: MessageService,
    private service: TarjetaService
    ) {
      this.items = [
        {
            label: 'Editar',
            icon: 'pi pi-user-edit',
            command: () => {
              this.editarTarjeta();
            }
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            command: () => {
              this.modalConfirmar = true;
            }
        },
    ];
    }


    
  ngOnInit(): void {
    this.listar();
  }

  async listar(){
   await this.service.listar().then(
      (data: any) =>{
        this.tarjetasData = data.map((item: any, index: number) => {
          const [fecha, horaCompleta] = item.tarj_FechaCreacion.split('T');
          const hora = horaCompleta.split('.')[0]; 
          return { 
            ...item, 
            indice: index + 1, 
            fecha: fecha, 
            hora: hora       
          };
        });
      }
    );
  }

  nuevaTarjeta(){
    this.titulo = '';
    this.accion ='Nueva';
    this.descripciones = [];
    this.validacionDescripcion = false;
    this.validacionTitulo = false;
    this.formulario = true;
  }

  editarTarjeta(){
    this.formulario = true;
    this.accion = 'Editar';
    this.validacionDescripcion = false;
    this.validacionTitulo = false;
    this.descripciones = [];
    if(Array.isArray(this.llenadoFila.tarj_Descripciones)){
      this.descripciones = this.llenadoFila.tarj_Descripciones.map(d => ({
        tarj_Descripcion: d
      }));
    }else{
      this.descripciones.push({
        tarj_Descripcion: this.llenadoFila.tarj_Descripciones
      });
    }
    
    this.titulo = this.llenadoFila.tarj_Titulo;
  }

  guardar(){
    if(this.titulo === ''){
      this.validacionTitulo = true;
    } 
    if(this.descripciones.length === 0){
      this.validacionDescripcion = true;
    }
    if(this.titulo && this.descripciones.length > 0){
      if(this.accion == 'Nueva'){
        this.guardarTarjeta();
      }else{
        this.actualizarTarjeta();
      }
    }
  }

  async guardarTarjeta(){
    
    const descripcionesNuevo = this.descripciones.map(d => d.tarj_Descripcion);
    const Modelo = {
      tarj_Titulo: this.titulo,
      tarj_Descripciones: descripcionesNuevo,
      tarj_FechaCreacion: Date.now(),
      usuario: 'Admin'
    }
    await this.service.crear(Modelo).then(
      response => {
        if(response.message === 'Exito'){
          this.formulario = false;
          this.listar();
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tarjeta guardada correctamente.', life: 3000 });
        }else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre de la tarjeta ya existe.', life: 3000 });
        }
      },error =>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al realizar la operación.', life: 3000 });
      }
    );
  }

  agregarDescripcion(tarj_Descripcion: string){
    if(tarj_Descripcion){
      this.descripciones.push({tarj_Descripcion: tarj_Descripcion});
      this.descripcion = '';
      this.validacionDescripcion = false;
      if(this.pTable){
        this.pTable.reset();
      }
    }else{
      this.validacionDescripcion = true;
    }
    
  }

  async actualizarTarjeta(){
    const descripcionesNuevo = this.descripciones.map(d => d.tarj_Descripcion);
    const Modelo = {
      tarj_Id: this.llenadoFila.tarj_Id,
      tarj_Titulo: this.titulo,
      tarj_Descripciones: descripcionesNuevo,
      usuario: 'Usuario'
    }
    await this.service.actualizar(Modelo).then(
      response =>{
        if(response.message == 'Exito'){
          this.formulario = false;
          this.listar();
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tarjeta actualizada correctamente.', life: 3000 });
        }else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre de la tarjeta ya existe.', life: 3000 });
        }
      },error =>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al realizar la operación.', life: 3000 });
      }
    );
  } 

  async eliminarTarjeta(){
    const usuario = 'Synx';
    await this.service.eliminar(this.llenadoFila.tarj_Id, usuario).then(
      response =>{
        if(response.message === 'Exito'){
        this.listar();
        this.modalConfirmar = false;
        this.messageService.add({ severity: 'success', summary: 'Error', detail: 'Tarjeta eliminada correctamente.', life: 3000 });
        }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la tarjeta.', life: 3000 });
        }
      },error =>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al realizar la operación.', life: 3000 });
      }
    )
  }

  cancelar(){
    this.listar();
    this.formulario = false;
  }

  eliminarDescripcion(index: number){
    if(index > -1 && index < this.descripciones.length){
      this.descripciones.splice(index, 1);
    }
    if(this.pTable){
      this.pTable.reset();
    }
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  
  filaSeleccionada(fila: any){
    this.llenadoFila = fila;
  }


}
