import { Component, OnInit, inject, ChangeDetectionStrategy, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonPicker, PickerButton, PickerColumn, PickerColumnOption } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { settingsSharp } from 'ionicons/icons';

import { FooterSideMenuComponent } from '../../components/footer-side-menu/footer-side-menu.component';
import { HeaderMenuComponent } from '../../components/header-menu/header-menu.component';
import { UniversityController } from '../../../../core/university/infraestructure/university.cotroller';
import { SettingController } from '../../../../core/setting/infraestructure/setting.controller';

import { CampusPermitted } from '../../../../core/shared/models/core.types';
import { Campus } from '../../../../core/university/domain/campus.domain';
import { Setting } from '../../../../core/setting/domain/setting.domain';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: true,
  imports: [
    IonMenu,
    IonContent,
    IonList,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonPicker,
    HeaderMenuComponent,
    FooterSideMenuComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuComponent implements OnInit, OnDestroy {

  @Input() settings!: Setting;
  @Output() emittOpenModal = new EventEmitter<boolean>();

  campusTitle!: string;
  isPickerOpen = false;

  private campuses: Campus[] = [];
  private selectedIndex: number = 0;
  private campusOptions: PickerColumnOption[] = [];
  private suscription!: Subscription;

  pickerColumns: PickerColumn[] = [
    {
      name: 'campus',
      selectedIndex: this.selectedIndex,
      options: []
    }
  ];

  pickerButtons: PickerButton[] = [
    {
      text: 'Cancelar',
      role: 'cancel',
    },
    {
      text: 'Seleccionar campus',
      handler: (value) => {
        this.settingCtrl.getCurrentSettings()
          .then(settings => {
            settings.chosenCampus = value.campus.value;
            this.settingCtrl.setSettings(settings)
            this.universityCtrl.changeCampus(value.campus.value);
          });
      },
    },
  ];

  private universityCtrl = inject(UniversityController);
  private settingCtrl = inject(SettingController);

  constructor() {
    addIcons({ settingsSharp });
  }

  async ngOnInit() {
    this.campuses = await this.universityCtrl.getCampusList();
    for (const camp of this.campuses) {
      this.campusOptions.push({ text: camp.text, value: camp.name });
    }
    this.pickerColumns[0].options = this.campusOptions;

    this.setCurrentCampus(this.universityCtrl.getCurrentCampus());

    this.suscription = this.universityCtrl.currentCampus
      .subscribe(campus => {
        this.setCurrentCampus(campus);
      });
  }

  private setCurrentCampus(campus: CampusPermitted) {
    this.selectedIndex = this.campuses.findIndex(camp => camp.name === campus);
    this.campusTitle = this.campuses[this.selectedIndex].text;
    this.pickerColumns[0].selectedIndex = this.selectedIndex;
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  showChanges(ev: Event) { }

  openOptions() {
    this.emittOpenModal.emit(true);
  }

  setHandlerPicker(isOpen: boolean) {
    this.isPickerOpen = isOpen;
  }

}
