import { Injectable, inject } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Network } from '@capacitor/network';

import { SettingController } from 'src/app/core/setting/infraestructure/setting.controller';

import { Setting } from 'src/app/core/setting/domain/setting.domain';


@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  isOnline: BehaviorSubject<boolean>;

  private settingCtrl = inject(SettingController);

  constructor() {
    this.isOnline = new BehaviorSubject(false);
  }

  async getStatus() {
    return await Network.getStatus();
  }

  async setOnlineModeBySettings(settings: Setting) {
    const status = await Network.getStatus();

    const isOnlinePermitted = (status.connected && (status.connectionType === 'wifi' || status.connectionType === 'unknown')) ||
      (status.connected && status.connectionType === 'cellular' && settings.useMobileData);

    this.isOnline.next(isOnlinePermitted);
    return isOnlinePermitted;
  }

  async initListenNetworkStatus() {
    return Network.addListener('networkStatusChange', async status => {

      const settings = await this.settingCtrl.getCurrentSettings();

      if (status.connected && (status.connectionType === 'wifi' || status.connectionType === 'unknown')) {
        this.isOnline.next(true);
        return;
      }

      if (status.connected && status.connectionType === 'cellular' && settings.useMobileData) {
        this.isOnline.next(true);
        return;
      }

      this.isOnline.next(false);
    });
  }

  async closeNetworkStatusListening() {
    await Network.removeAllListeners();
  }

}
