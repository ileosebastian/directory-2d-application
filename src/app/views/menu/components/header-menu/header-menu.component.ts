import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy, ViewChild, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { IonChip, IonHeader, IonIcon, IonLabel, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonIcon as Icon } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { ellipse } from 'ionicons/icons';

import { NetworkService } from '../../../shared/services/network/network.service';


@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonLabel,
    IonChip,
    IonIcon
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderMenuComponent implements AfterViewInit, OnDestroy {

  @ViewChild('iconStatus', { static: true }) icon!: Icon;

  isConnected: boolean;
  @Input() campusTitle: string = "campus";

  private suscription!: Subscription;

  private networkSrvc = inject(NetworkService);

  constructor() {
    addIcons({ ellipse });
    this.isConnected = this.networkSrvc.isOnline.value;
  }

  ngAfterViewInit(): void {
    this.suscription = this.networkSrvc.isOnline.subscribe(isOnline => {
      this.icon.color = isOnline ? 'success' : 'danger';
      const label = document.getElementById('label-status');
      if (label) {
        label.innerHTML = isOnline ? 'conectado' : 'desconectado';
      }
    });
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

}
