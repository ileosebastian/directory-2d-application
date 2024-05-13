import { Component, OnInit } from '@angular/core';
import { ModalButtonsComponent } from '../modal-buttons/modal-buttons.component';
import { isAMobileDevice } from 'src/app/core/shared/utils/is-a-mobile-device.util';
import { isPlatform } from '@ionic/angular';
import { ModalButton } from 'src/app/views/shared/models/app.interfaces';


@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  standalone: true,
  imports: [
    ModalButtonsComponent,
  ],
})
export class ErrorComponent implements OnInit {

  errorBtns: ModalButton[] = [];
  message: string;

  constructor() {
    this.message = '';
    if (isAMobileDevice() && !isPlatform('mobileweb')) {
      this.errorBtns.push({
        color: 'danger',
        text: 'salir',
        disable: false,
        role: 'exit',
      });
    }
  }

  ngOnInit(): void { }

}
