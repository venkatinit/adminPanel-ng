import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


  const spinner: HTMLElement | null = document.getElementById("spinner");

function loadData(): void {
  if (spinner) {
    spinner.removeAttribute('hidden');
  }

  fetch('https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=5000ms')
    .then(response => response.json())
    .then((data: any) => {
      if (spinner) {
        spinner.setAttribute('hidden', '');
      }
      console.log(data);
    });
}