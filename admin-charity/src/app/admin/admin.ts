import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // 后端接口前缀为 /root/api，管理端路径需包含这部分
  private baseUrl = '/root/api/admin'; 

  constructor(private http: HttpClient) {}

  // 管理端获取所有活动 → 完整路径：/root/api/admin/events
  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/events`);
  }

  // 删除活动 → 完整路径：/root/api/admin/events/[id]
  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/events/${id}`);
  }

  // 添加活动 → 完整路径：/root/api/admin/events
  addEvent(event: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/events`, event);
  }

  // 编辑活动 → 完整路径：/root/api/admin/events/[id]
  editEvent(id: number, event: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/events/${id}`, event);
  }

  // 获取所有报名数据 → 完整路径：/root/api/admin/registrations
  getRegistrations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/registrations`);
  }
}