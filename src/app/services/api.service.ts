import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '../shared/api.enum';
import { IPoint } from '../shared/interfaces/ipoint';
import { Observable } from 'rxjs';
import { IDestination } from '../shared/interfaces/idestination';
import { IPostPoint } from '../shared/interfaces/ipostpoint';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private api = Api

  constructor(private http: HttpClient) { }

  getPoints(path: string) {
    return this.http.get<IPoint[]>(`${this.api.url}/${path}`)
  }

  getOffers(path: string) {
    return this.http.get(`${this.api.url}/${path}`)
  }

  getDestinations(path: string) {
    return this.http.get<IDestination[]>(`${this.api.url}/${path}`)
  }

  setFavoriteClick(path: string, point: IPoint): Observable<IPoint> {
    return this.http.put<IPoint>(`${this.api.url}/${path}/${point.id}`, {
      ...point,
      is_favorite: point.is_favorite
    })
  }

  editPointClick(path: string, point: any): Observable<IPoint> {
    return this.http.put<IPoint>(`${this.api.url}/${path}/${point.id}`, {
      ...point
    })
  }

  deleteData(path: string, pointId: string) {
    return this.http.delete(
      `${this.api.url}/${path}/${pointId}`, { responseType: 'text'}
    )
  }

  postData(path: string, point: IPostPoint) {
    return this.http.post(
      `${this.api.url}/${path}`,
      point)
  }

}
