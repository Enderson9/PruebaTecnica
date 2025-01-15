import { Injectable } from '@angular/core';
import { environment } from '../../enviroment/enviroment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TarjetaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  async listar(){
    return await this.http.get<any>(`${this.apiUrl}/tarjeta/listar`).toPromise();
  }

  async crear(tarjeta: any){
    return await this.http.post<any>(`${this.apiUrl}/tarjeta/crear`, tarjeta).toPromise();
  }

  async actualizar(tarjeta: any){
    return await this.http.put<any>(`${this.apiUrl}/tarjeta/actualizar`, tarjeta).toPromise();
  }

  async eliminar(tarj_Id: number, usuario: string){
    return await this.http.delete<any>(`${this.apiUrl}/tarjeta/eliminar/${tarj_Id}/${usuario}`).toPromise();
  }
}
