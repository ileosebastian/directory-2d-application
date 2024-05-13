import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ModalButtonsComponent } from '../modal-buttons/modal-buttons.component';

import { ModalButton } from '../../../shared/models/app.interfaces';
import { isAMobileDevice } from 'src/app/core/shared/utils/is-a-mobile-device.util';
import { isPlatform } from '@ionic/angular';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [

    ModalButtonsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent implements OnInit {

  welcomeBtns: ModalButton[] = [
    // {
    //   role: 'exit',
    //   text: 'salir',
    //   color: 'danger',
    //   disable: false
    // },
    {
      role: 'goto',
      text: 'continuar',
      color: 'primary',
      disable: false,
      goto: 'selection'
    }
  ];

  constructor() {
    if (isAMobileDevice() && !isPlatform('mobileweb')) {
      this.welcomeBtns.push({
        role: 'exit',
        color: 'danger',
        text: 'salir',
        disable: false,
      });
      this.welcomeBtns.reverse();
    }
  }

  ngOnInit() { }

}
