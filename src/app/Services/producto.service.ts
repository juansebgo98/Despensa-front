import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Constants } from 'src/app/utils/constant';
import Swal from 'sweetalert2';
import { Producto } from '../models/Producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http: HttpClient, private router: Router) { }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(Constants.API_URL_PRODUCTO);
  }

  getProducto(id: number): Observable<Producto> {
    const url = `${Constants.API_URL_PRODUCTO}/${id}`;
    return this.http.get<Producto>(url).pipe(
      catchError(e => {
        return throwError(e)
      })
    );
  }

  async existeProducto(id: number): Promise<boolean> {
    let existe = false;
    this.getProducto(id).subscribe(p=>{
      existe = true;
    },error=>{
      existe = false;
    })
    return existe;
  }

  getProductoAlmacenamiento(id: number): Observable<Producto[]> {
    const url = `${Constants.API_URL_PRODUCTO}/almacenamiento/${id}`;
    return this.http.get<Producto[]>(url).pipe(
      catchError(e => {
        this.router.navigate(['/productos']);
        console.error(e.error.mensaje);
        Swal.fire('Error al obtener', e.error.mensaje, 'error');
        return throwError(e)
      })
    );;
  }

  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(Constants.API_URL_PRODUCTO, producto).pipe(
      map((response: any) => response.producto as Producto),
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  updateProducto(producto: Producto): Observable<Producto> {
    const url = `${Constants.API_URL_PRODUCTO}/${producto.id}`;
    return this.http.put<Producto>(url, producto, { headers: Constants.httpHeaders }).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  deleteProducto(id: number): Observable<{}> {
    const url = `${Constants.API_URL_PRODUCTO}/${id}`;
    return this.http.delete(url, { headers: Constants.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
