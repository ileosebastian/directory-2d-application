import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IonFooter, IonTitle, IonToolbar } from '@ionic/angular/standalone';


@Component({
  selector: 'app-footer-side-menu',
  templateUrl: './footer-side-menu.component.html',
  styleUrls: ['./footer-side-menu.component.scss'],
  standalone: true,
  imports: [
    IonFooter,
    IonToolbar,
    IonTitle
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterSideMenuComponent { }
