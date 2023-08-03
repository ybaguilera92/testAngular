import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { EnviromentsService } from './enviroments.service';
import { BaseService } from './base-service.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService<any> implements OnInit {
  headers = new HttpHeaders();
  onCategoryChanged: BehaviorSubject<any>;
  constructor(private http: HttpClient, private environment: EnviromentsService) {

    super(http, environment.getEnviroment().apiUrl, 'Category');
    this.onCategoryChanged = new BehaviorSubject({});
  }
  ngOnInit(): void {
  }


  addCategory(params) {
    return this.create(params);
  }


  deleteCategory(params): Observable<any> {
    return this.delete(params);
  }

  saveCategory(params, index) {
    return this.update(params, index);
  }

  getCategories(params): Observable<any> {
    const result = this.get(params);
    return result;
  }

  getCategoryOne(index: any): Promise<any> {
    const result = firstValueFrom(this.getById(index));
    result.then(res => {
      this.onCategoryChanged.next(res.data);
    });
    return result;
  }
}
