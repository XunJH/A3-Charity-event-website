import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true, // 根组件也声明为独立组件
  imports: [CommonModule, RouterOutlet], // 导入路由出口
  template: `<router-outlet></router-outlet>`, // 简化模板
})
export class AppComponent {}