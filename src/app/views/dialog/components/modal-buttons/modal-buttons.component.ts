import { NgFor } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';

import { IonButton, IonLabel } from '@ionic/angular/standalone';

import { App } from '@capacitor/app';

import { DialogService } from '../../services/dialog.service';

import { ModalButton } from '../../../shared/models/app.interfaces';


@Component({
  selector: 'app-modal-buttons',
  templateUrl: './modal-buttons.component.html',
  styleUrls: ['./modal-buttons.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonLabel,
    NgFor
  ],
})
export class ModalButtonsComponent implements OnInit {

  @Input() buttonOptions: ModalButton[] = [];

  private dialogSrvc = inject(DialogService);

  ngOnInit() { }

  async setBehaviorByRole(button: ModalButton) {

    if (button.role === 'exit') {
      await App.exitApp();
      return;
    }

    if (button.role === 'goto' && button.goto) {
      this.dialogSrvc.setCurrentDialog(button.goto);
      return;
    }

    if (button.role === 'cancel' && button.goto) {
      this.dialogSrvc.setCurrentDialog(button.goto);
      return;
    }

    if (button.role === 'done') {
      this.dialogSrvc.setCurrentDialog('exit-dialog');
      return;
    }

  }

  async exitApplication() {
    await App.exitApp();
  }


}
