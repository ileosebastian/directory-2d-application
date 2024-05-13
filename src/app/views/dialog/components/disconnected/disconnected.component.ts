import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ModalButtonsComponent } from '../modal-buttons/modal-buttons.component';

import { ModalButton } from '../../../shared/models/app.interfaces';


@Component({
  selector: 'app-disconnected',
  templateUrl: './disconnected.component.html',
  styleUrls: ['./disconnected.component.scss'],
  standalone: true,
  imports: [
    ModalButtonsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisconnectedComponent implements OnInit {

  disconnectedBtns: ModalButton[] = [
    {
      role: 'goto',
      text: 'volver',
      color: 'secondary',
      disable: false,
      goto: 'welcome',
    },
  ];

  constructor() { }

  ngOnInit() { }

}
