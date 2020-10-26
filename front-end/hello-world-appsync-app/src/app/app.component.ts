import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  app_name: string = 'My App';
  source_code_link: string = 'https://github.com/SaraPrager/hello-world-appsync-app';
}
