// event-edit.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 用于 ngModel 双向绑定
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../admin/admin';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [CommonModule, FormsModule], // 必须导入 FormsModule 才能使用 ngModel
  templateUrl: './event-edit.html'
})
export class EventEditComponent {
  // 活动表单数据
  event = {
    title: '',
    description: '',
    event_date: '',
    location: '',
    category_id: '',
    organizer: ''
  };

  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // 提交表单（保存活动）
  onSubmit() {
    // 调用服务提交数据到后端
    this.adminService.addEvent(this.event).subscribe({
      next: () => {
        alert('活动添加成功！');
        this.goBack(); // 保存后返回活动列表
      },
      error: (err) => console.error('添加活动失败:', err)
    });
  }

  // 返回活动列表页
  goBack() {
    this.router.navigate(['/admin/events']);
  }
}