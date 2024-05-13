import { Component, OnInit } from '@angular/core';
import { ModalButtonsComponent } from '../modal-buttons/modal-buttons.component';
import { ModalButton } from 'src/app/views/shared/models/app.interfaces';
import { isAMobileDevice } from 'src/app/core/shared/utils/is-a-mobile-device.util';
import { isPlatform } from '@ionic/angular/standalone';


@Component({
  selector: 'app-bootstrap-error',
  templateUrl: './bootstrap-error.component.html',
  styleUrls: ['./bootstrap-error.component.scss'],
  standalone: true,
  imports: [
    ModalButtonsComponent,
  ],
})
export class BootstrapErrorComponent implements OnInit {

  errorBtns: ModalButton[] = [];

  constructor() {
    if (isAMobileDevice() && !isPlatform('mobileweb')) {
      this.errorBtns.push({
        color: 'danger',
        text: 'salir',
        disable: false,
        role: 'exit',
      });
    }
  }

  ngOnInit() { }

}
