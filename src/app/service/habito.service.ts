import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateHabito, Habito } from '../interface/habito.model';

@Injectable({
  providedIn: 'root',
})
export class HabitoService {
  private baseUrl = 'http://localhost:8080/habitos';

  constructor(private http: HttpClient) {}

  getHabitos(): Observable<Habito[]> {
    return this.http.get<Habito[]>(this.baseUrl);
  }

  postHabitos(body: Habito): Observable<Habito> {
    return this.http.post<Habito>(this.baseUrl, body);
  }
}
