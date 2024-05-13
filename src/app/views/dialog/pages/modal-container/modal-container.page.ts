import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, Input, OnInit, WritableSignal, effect, inject } from '@angular/core';

import { IonModal } from '@ionic/angular/standalone';

import { WelcomeComponent } from '../../components/welcome/welcome.component';
import { SelectionComponent } from '../../components/selection/selection.component';
import { InstallationComponent } from '../../components/installation/installation.component';
import { DisconnectedComponent } from '../../components/disconnected/disconnected.component';
import { DatabaseErrorComponent } from '../../components/database-error/database-error.component';
import { BootstrapErrorComponent } from '../../components/bootstrap-error/bootstrap-error.component';

import { DialogState } from '../../../../core/shared/models/core.types';
import { DialogService } from '../../services/dialog.service';
import { InstallationErrorComponent } from '../../components/installation-error/installation-error.component';


@Component({
  selector: 'app-modal-container',
  templateUrl: './modal-container.page.html',
  styleUrls: ['./modal-container.page.scss'],
  standalone: true,
  imports: [
    IonModal,

    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,

    WelcomeComponent,
    SelectionComponent,
    InstallationComponent,
    DisconnectedComponent,
    DatabaseErrorComponent,
    BootstrapErrorComponent,
    InstallationErrorComponent,
  ],
})
export class ModalContainerPage implements OnInit {

  @Input() isOpenDialog!: boolean;
  @Input() status!: DialogState;

  currentState: WritableSignal<DialogState | null>;

  private dialogSrvc = inject(DialogService);

  constructor() {
    this.currentState = this.dialogSrvc.getCurrentDialog();

    effect(() => {
      if (this.currentState() === 'exit-dialog') {
        this.isOpenDialog = false;
      }
    });
  }

  ngOnInit() {
    if (this.status) this.dialogSrvc.setCurrentDialog(this.status);
  }

}
