import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';
import { AdminService } from '../../../admin/admin'; 

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule], // 必须导入，否则 *ngFor 等指令无效
  templateUrl: './event-list.html'
})
export class EventListComponent implements OnInit {
  events: any[] = []; // 存储活动列表数据

  // 注入路由服务和数据服务
  constructor(
    private router: Router,
    private adminService: AdminService
  ) {}

  // 组件初始化时加载活动数据
  ngOnInit() {
    this.loadEvents();
  }

  // 加载活动列表
  loadEvents() {
    this.adminService.getEvents().subscribe({
      next: (data) => this.events = data,
      error: (err) => console.error('加载活动失败:', err)
    });
  }

  // 跳转到添加活动页面
  goToAddEvent() {
    this.router.navigate(['/admin/events/add']); // 需配置对应路由
  }

  // 筛选活动（示例：可根据输入框和下拉框的值筛选）
  filterEvents() {
    // 实际逻辑：获取输入框和下拉框的值，调用服务筛选
    console.log('执行筛选');
  }

  // 跳转到编辑活动页面
  editEvent(eventId: number) {
    this.router.navigate(['/admin/events/edit', eventId]); // 需配置对应路由
  }

  // 删除活动
  deleteEvent(eventId: number) {
    if (confirm('确定要删除这个活动吗？')) {
      this.adminService.deleteEvent(eventId).subscribe({
        next: () => {
          alert('删除成功');
          this.loadEvents(); // 重新加载列表
        },
        error: (err) => console.error('删除失败:', err)
      });
    }
  }
}