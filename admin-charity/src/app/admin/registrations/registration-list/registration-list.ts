import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registration-list.html',
  styleUrls: ['./registration-list.css']
})
// 类名必须与路由中导入的一致
export class RegistrationListComponent { }