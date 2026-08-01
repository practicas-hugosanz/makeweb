import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Only hide the elements we are about to animate if JavaScript is actually
// running — without this flag a script failure would leave a blank page.
document.body.classList.add('js-loading');

bootstrapApplication(App, appConfig).catch((err) => {
  document.body.classList.remove('js-loading', 'is-locked');
  console.error(err);
});
