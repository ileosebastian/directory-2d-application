// By Angular
import { Component, inject, OnDestroy, WritableSignal, effect } from '@angular/core';
import { NgIf } from '@angular/common';

// By Ionic
import { IonApp, IonModal, IonRouterOutlet, Platform } from '@ionic/angular/standalone';

// Components
import { SideMenuComponent } from './views/menu/pages/side-menu/side-menu.component';
import { DataOptionsPage } from './views/menu/pages/data-options/data-options.page';
import { ModalContainerPage } from './views/dialog/pages/modal-container/modal-container.page';

// Services
import { NetworkService } from './views/shared/services/network/network.service';

// Models
import { Setting } from './core/setting/domain/setting.domain';
import { DialogState, UUID } from './core/shared/models/core.types';
import { DialogService } from './views/dialog/services/dialog.service';
import { AppService } from './app.service';
import { UniversityController } from './core/university/infraestructure/university.cotroller';
import { DetailTourPage } from './views/detail/pages/detail-tour/detail-tour.page';
import { TourService } from './views/shared/services/tour.service';

import { SplashScreen } from "@capacitor/splash-screen";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    ModalContainerPage,
    SideMenuComponent,
    DataOptionsPage,
    IonModal,
    DetailTourPage,
    NgIf
  ],
})
export class AppComponent implements OnDestroy {

  isReady: boolean;
  isOpenDataOptions: boolean;

  id!: UUID | string;
  color!: string;
  isActiveTour: WritableSignal<boolean>;

  settings!: Setting;
  isFirstBoot: boolean;

  private currenteDialogState: WritableSignal<DialogState | null>

  readonly appInitializer = inject(AppService);

  private readonly universityCtrl = inject(UniversityController);
  private readonly dialogSrvc = inject(DialogService);
  private readonly networkSrvc = inject(NetworkService);
  private readonly platform = inject(Platform);

  private tourService = inject(TourService);

  constructor() {
    this.isActiveTour = this.tourService.getIsActiveTour();
    this.color = this.tourService.color;

    // set to show application when each process has been end
    this.isReady = false;

    // set settings for components nested
    this.settings = this.appInitializer.setting;
    // set first boot state 
    this.isFirstBoot = this.settings.isFirstBoot;

    // to open and close modal data options (user preferences)
    this.isOpenDataOptions = false;

    // listen states of modal dialog bootstrap
    this.currenteDialogState = this.dialogSrvc.getCurrentDialog();
    effect(() => {
      if (this.currenteDialogState() === 'exit-dialog') {
        this.isFirstBoot = false;
      }

      if (this.isActiveTour()) {
        this.id = this.tourService.id;
        this.color = this.tourService.color;
      }

    });

    this.setupApp();
  }

  closeTour(data: boolean) {
    this.tourService.setIsActiveTour(data);
  }

  setDataOption(data: boolean) {
    this.isOpenDataOptions = data;
  }

  async ngOnDestroy() {
    await this.appInitializer.terminateApp();
    await this.networkSrvc.closeNetworkStatusListening();
  }

  private async setupApp() {
    this.platform.ready()
      .then(async () => {
        try {

          if (!this.appInitializer.setting.isFirstBoot) {
            await this.universityCtrl.setupUniversityData(
              this.appInitializer.setting.chosenCampus,
              this.appInitializer.isOnline
            );
          }

        await SplashScreen.hide();
          this.isReady = true;
        } catch (error) {
          console.error("=>", error);
        }
      });
  }

}
