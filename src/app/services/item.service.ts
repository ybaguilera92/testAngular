import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { EnviromentsService } from './enviroments.service';
import { BaseService } from './base-service.service';


@Injectable({
  providedIn: 'root'
})
export class ItemService extends BaseService<any> implements OnInit {
  headers = new HttpHeaders();
  onItemChanged: BehaviorSubject<any>;
  constructor(private http: HttpClient, private environment: EnviromentsService) {
    super(http, environment.getEnviroment().apiUrl, 'Item');
    this.onItemChanged = new BehaviorSubject({});
  }
  ngOnInit(): void {

  }

  addItem(params) {
    return this.create(params);
  }


  deleteItem(params): Observable<any> {
    return this.delete(params);
  }

  saveItem(params, index) {    
    return this.update(params, index);
  }

  getItems(params): Observable<any> {
    const result = this.get(params);
    return result;
  }

  getItemOne(index: any): Promise<any> {
    const result = firstValueFrom(this.getById(index));
    result.then(res => {
      this.onItemChanged.next(res.data);
    });
    return result;
  }
}
