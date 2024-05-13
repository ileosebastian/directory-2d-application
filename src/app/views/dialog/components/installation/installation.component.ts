import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, WritableSignal, effect, inject, signal } from '@angular/core';

import { IonProgressBar } from '@ionic/angular/standalone';

import { ModalButtonsComponent } from '../modal-buttons/modal-buttons.component';

import { DialogService } from '../../services/dialog.service';
import { NetworkService } from 'src/app/views/shared/services/network/network.service';
import { SQLiteStoreController } from 'src/app/core/SQLiteStore/sqlite-store.controller';
import { SettingController } from 'src/app/core/setting/infraestructure/setting.controller';

import { ModalButton } from '../../../shared/models/app.interfaces';
import { Campus } from '../../../../core/university/domain/campus.domain';
import { DialogState } from 'src/app/core/shared/models/core.types';
import { whatPlatformIsIt } from 'src/app/core/shared/utils/what-platform-is-it.utils';


@Component({
  selector: 'app-installation',
  templateUrl: './installation.component.html',
  styleUrls: ['./installation.component.scss'],
  standalone: true,
  imports: [
    IonProgressBar,
    TitleCasePipe,
    ModalButtonsComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstallationComponent implements OnInit {

  campus: Campus | null;

  installationButtons: ModalButton[] = [
    {
      role: 'cancel',
      text: 'cancelar',
      color: 'danger',
      disable: false,
      goto: 'selection'
    }
  ];

  cancelProgress: boolean = true;
  private currentDialog: WritableSignal<DialogState | null>;
  progress: WritableSignal<number> = signal(0);

  intervalHanlder: any;

  private dialogSrvc = inject(DialogService);
  private settingCtrl = inject(SettingController);
  private networkSrvc = inject(NetworkService);
  private _sqlite = inject(SQLiteStoreController);

  constructor() {
    this.campus = this.dialogSrvc.getMessage();
    this.currentDialog = this.dialogSrvc.getCurrentDialog();

    effect(async () => {

      if (this.currentDialog() === 'selection') {
        await this._sqlite.deleteAllOnlineDataInDeviceByCampus();
      }

      if (this.progress() >= 1) {

        this.installationButtons = [
          {
            role: 'done',
            text: 'finalizar',
            color: 'tertiary',
            disable: false
          }
        ];
        this.cancelProgress = false;
        await this.finalizeBootstrapApp();

        return;
      }

    });
  }

  async ngOnInit() {
    const stat = await this.networkSrvc.getStatus();
    if (!(stat.connected)) {
      this.dialogSrvc.setCurrentDialog('disconnected');
      return;
    }

    if (this.campus) {
      try {
        await this._sqlite.saveAllOnlineDataInDeviceByCampus(this.campus.name, this.progress);
      } catch (error) {
        console.error("=>", error);
        this.dialogSrvc.setCurrentDialog('installation-error');
      }
    }

  }

  async finalizeBootstrapApp() {
    this.settingCtrl.getCurrentSettings()
      .then(async setting => {
        if (this.campus) { // it should always have at least one campus package installed
          setting.installedCampusPackages = [this.campus.name];
          setting.chosenCampus = this.campus.name;
        }
        setting.isFirstBoot = false;
        const re = await this.settingCtrl.setSettings(setting);
      });
  }

}
