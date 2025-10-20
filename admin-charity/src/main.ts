import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http'; // Angular 16+ 提供 HTTP 服务的方式

// 启动应用，注入路由和 HTTP 服务
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient() // 替代旧版的 HttpClientModule
  ]
}).catch(err => console.error(err));