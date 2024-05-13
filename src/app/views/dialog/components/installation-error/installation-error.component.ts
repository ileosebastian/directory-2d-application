import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ModalButtonsComponent } from '../modal-buttons/modal-buttons.component';

import { ModalButton } from 'src/app/views/shared/models/app.interfaces';


@Component({
  selector: 'app-installation-error',
  templateUrl: './installation-error.component.html',
  styleUrls: ['./installation-error.component.scss'],
  standalone: true,
  imports: [
    ModalButtonsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstallationErrorComponent implements OnInit {

  errorBtns: ModalButton[] = [
    {
      color: 'danger',
      disable: false,
      role: 'goto',
      text: 'regresar',
      goto: 'welcome'
    }
  ];

  constructor() { }

  ngOnInit() { }

}
