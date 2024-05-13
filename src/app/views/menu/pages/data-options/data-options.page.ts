import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild, WritableSignal, effect, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

import { IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonModal, IonProgressBar, IonRadio, IonRadioGroup, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, arrowForwardCircle, arrowDownCircle, download, push, trashBin } from 'ionicons/icons';

import { SettingController } from 'src/app/core/setting/infraestructure/setting.controller';
import { NetworkService } from 'src/app/views/shared/services/network/network.service';
import { UniversityController } from 'src/app/core/university/infraestructure/university.cotroller';
import { SQLiteStoreController } from 'src/app/core/SQLiteStore/sqlite-store.controller';

import { FOR_ALL_FACULTIES, FOR_ONE_FACULTY } from 'src/app/core/shared/data/constants.data';
import { Setting } from '../../../../core/setting/domain/setting.domain';
import { Campus } from 'src/app/core/university/domain/campus.domain';
import { Faculty } from 'src/app/core/university/domain/faculty.domain';
import { CampusPermitted } from 'src/app/core/shared/models/core.types';

import { isAMobileDevice } from 'src/app/core/shared/utils/is-a-mobile-device.util';
import { ReloadDataService } from 'src/app/views/shared/services/reload-data.service';


@Component({
  selector: 'app-data-options',
  templateUrl: './data-options.page.html',
  styleUrls: ['./data-options.page.scss'],
  standalone: true,
  imports: [
    IonModal,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonIcon,
    IonProgressBar,
    NgIf,
    NgFor
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataOptionsPage implements OnInit {

  @ViewChild(IonModal) modal!: IonModal;

  @Input() isOpenModal: boolean = false;
  @Input() settings!: Setting;
  @Output() emittCloseModal = new EventEmitter<boolean>();

  isAMobileDevice: boolean;
  useMobileData: boolean;
  campusInstalled: CampusPermitted[];

  campusAvaliable: WritableSignal<Campus[]>;
  progress: WritableSignal<number>;

  SHOW_ALL = FOR_ALL_FACULTIES;
  SHOW_ONE = FOR_ONE_FACULTY;

  isProgress: boolean;

  campuses: Campus[] = [];
  faculties: Faculty[] = [];

  private storeCtrl = inject(SQLiteStoreController);
  private settingCtrl = inject(SettingController);
  private networkSrvc = inject(NetworkService);
  private universityCtrl = inject(UniversityController);

  private reloadDataSrvc = inject(ReloadDataService);

  constructor() {
    addIcons({ closeOutline, arrowForwardCircle, arrowDownCircle, download, push, trashBin });
    this.isAMobileDevice = isAMobileDevice();

    this.progress = signal(-2);
    this.campusInstalled = [];

    this.isProgress = false;
    this.useMobileData = false;
    this.campusAvaliable = signal([]);

    effect(() => {
      if (this.progress() === -1) {
        setTimeout(() => {
          this.isMessageOpen = false;
          this.isProgress = false;
          this.progress.set(-2);
        }, 1500);
      }
    });
  }

  async ngOnInit() {
    this.settings = await this.settingCtrl.getCurrentSettings();
    this.useMobileData = this.settings.useMobileData;
    this.campuses = await this.universityCtrl.getCampusList();
    this.campusInstalled = this.settings.installedCampusPackages;
    this.campusAvaliable.set(this.campuses.filter(c => !this.campusInstalled.includes(c.name)));
  }

  isMessageOpen = false;
  message: string = '';
  color: string = 'primary';

  private async updateCampusData(context: 'install' | 'update' | 'delete', campus: CampusPermitted) {
    try {
      const newCampusInstalled = context === 'delete' ?
        this.campusInstalled.filter(camp => camp !== campus) :
        context === 'install' ?
          [...this.campusInstalled, campus] :
          this.campusInstalled;

      const setting = await this.settingCtrl.getCurrentSettings();
      setting.installedCampusPackages = newCampusInstalled;
      await this.settingCtrl.setSettings(setting);

      this.campusInstalled = newCampusInstalled;
      this.campusAvaliable.set(this.campuses.filter(c => !this.campusInstalled.includes(c.name)));
    } catch (error) {
      console.error("=> ", error);
    }
  }

  async manageByContextAndCampus(context: 'install' | 'update' | 'delete', campusName: CampusPermitted) {
    try {
      this.isMessageOpen = true;
      this.isProgress = true;

      if ((!this.networkSrvc.isOnline.value) && context !== 'delete') {
        this.message = `No esta conectado. Por favor, intente más tarde.`;
        this.progress.set(-1);
        return;
      }

      this.progress.set(0);

      const contextualization = context === 'install' ?
        { textGerund: 'Instalando', textPast: 'instalado', color: 'secondary' } :
        context === 'update' ?
          { textGerund: 'Actualizando', textPast: 'actualizado', color: 'tertiary' } :
          { textGerund: 'Eliminando', textPast: 'eliminado', color: 'danger' };

      this.message = `${contextualization.textGerund} datos del ${this.getCampusTextByName(campusName)}...`;
      this.color = contextualization.color;

      if (context === 'delete') await this.storeCtrl.removeByCampus(campusName, this.progress);
      else await this.storeCtrl.saveByCampus(context, campusName, this.progress);

      this.message = `Se ha ${contextualization.textPast} con exito!`;
      this.progress.set(-1);

      await this.updateCampusData(context, campusName);
      this.reloadDataSrvc.setIsReload(true);
    } catch (error) {
      console.error("=>", error);
    }
  }

  getCampusTextByName(name: CampusPermitted) {
    const camps = this.campuses.filter(camp => camp.name === name);

    const camp = camps.pop();

    if (camp) return camp.text;

    throw new Error(`${name} is not among the permitted campuses.`);
  }

  cancel() {
    this.reloadDataSrvc.setIsReload(false);
    this.modal.dismiss('cancel');
  }

  onWillDismiss(event: Event) {
    this.emittCloseModal.emit(false);
    this.isOpenModal = false;
  }

  async changeUseMobileData(ev: any) {
    this.useMobileData = ev.detail.checked;

    this.settingCtrl.getCurrentSettings()
      .then(async settings => {
        settings.useMobileData = this.useMobileData;
        this.settings = await this.settingCtrl.setSettings(settings);
        await this.networkSrvc.setOnlineModeBySettings(this.settings);
      });
  }

}
