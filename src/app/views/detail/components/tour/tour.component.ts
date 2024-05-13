import { NgIf, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, inject } from '@angular/core';

import { Subscription } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { IonButton, IonIcon, IonSkeletonText, Platform } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locate, contract, expand } from 'ionicons/icons';

import { LocationSelectorComponent } from './components/location-selector/location-selector.component';
import { MessageCenteredComponent } from '../../../shared/components/message-centered/message-centered.component';

import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { ScreenOrientationService } from 'src/app/views/shared/services/screen-orientation/screen-orientation.service';
import { TourController } from 'src/app/core/tour/infraestructure/tour.controller';
import { MapController } from 'src/app/core/map/infraestructure/map.controller';
import { NetworkService } from 'src/app/views/shared/services/network/network.service';

import { AllDetailsPlace, Place } from '../../../../core/place/domain/place.domain';
import { Blueprint } from '../../../../core/tour/domain/tour.domain';
import { Plane } from '../../../../core/map/domain/plane.domain';
import { Entry } from '../../../../core/map/domain/entry.domain';
import { Tour } from '../../../../views/shared/models/tour.interface';
import { App } from '@capacitor/app';


@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss'],
  standalone: true,
  imports: [
    IonSkeletonText,
    IonButton,
    IonIcon,
    NgIf,
    TitleCasePipe,
    LocationSelectorComponent,
    MessageCenteredComponent
  ],
})
export class TourComponent implements OnInit, OnChanges, OnDestroy {

  @Input() destinyItem!: AllDetailsPlace;
  @Output() emittNewDestinyItem = new EventEmitter<AllDetailsPlace>();

  originItem!: Entry | Place | null;

  stopLoadingMap!: boolean;
  showMapError!: boolean;
  isFullscreen!: boolean;
  isOpenDialog!: boolean;
  private isFirstTimeTour!: boolean;

  facultyName!: string;
  plans!: Plane[];

  private NORMALLY_SIZES = {
    'size-xl': '9',
    'size-lg': '9',
    'size-md': '8',
    'size-sm': '8',
    'size-xs': '12',
  };

  isWebPlatform: boolean;
  private isOnlineMode: boolean;

  private networkSrvc = inject(NetworkService);
  private mapCtrl = inject(MapController);
  private tourCtrl = inject(TourController);
  private screen = inject(ScreenOrientation);
  private screenSrvc = inject(ScreenOrientationService);
  private renderer = inject(Renderer2);
  platform = inject(Platform);

  private suscriptorOnlineMode: Subscription;

  constructor() {
    this.stopLoadingMap = false;
    this.showMapError = false;
    this.isFullscreen = false;
    this.isFirstTimeTour = true;
    this.isOpenDialog = false;

    this.isWebPlatform = Capacitor.getPlatform() === 'web';

    addIcons({ locate, contract, expand });

    this.isOnlineMode = this.networkSrvc.isOnline.value;

    this.suscriptorOnlineMode = this.networkSrvc.isOnline
      .subscribe(isOnline => {
        this.isOnlineMode = isOnline;
      });
  }

  async ngOnInit() {
    const canvas = document.getElementById('map');

    if (canvas instanceof HTMLCanvasElement) {
      this.tourCtrl.createStage(canvas);
    }
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    const destiny = changes['destinyItem'].currentValue as AllDetailsPlace;
    const canvas = document.getElementById('map');

    if (destiny && canvas instanceof HTMLCanvasElement && this.isFirstTimeTour) {
      try {
        this.facultyName = destiny.faculty;
        const { blueprints, plans } = await this.mapCtrl.generateInitialState(this.isOnlineMode, destiny.faculty, null, destiny.wayPointId);
        this.originItem = null; // first floor (Entry);
        await this.tourCtrl.executeAnimation(blueprints);
        this.plans = plans;

        this.showAnimation();
      } catch (error) {
        this.showAnimationError();
        console.error("=>", error);
      }
    }

    if (!destiny) {
      this.showAnimationError();
    }
  }

  ngOnDestroy(): void {
    this.tourCtrl.stopTour();
    this.suscriptorOnlineMode.unsubscribe();
  }

  async generateNewTour(data: Tour) {
    try {
      this.originItem = data.origin;

      if (this.destinyItem.id !== data.destiny.id) {
        this.emittNewDestinyItem.emit(data.destiny);
      }

      this.showLoadingAnimation();

      let initState: { blueprints: Blueprint[], plans: Plane[] };

      if (data.startId) {
        initState = await this.mapCtrl.generateInitialState(this.isOnlineMode, this.facultyName, data.startId, data.goalId);
      } else {
        initState = await this.mapCtrl.generateInitialState(this.isOnlineMode, this.facultyName, data.startId, data.goalId);
      }

      await this.tourCtrl.executeAnimation(initState.blueprints);

      this.showAnimation();
      this.isFirstTimeTour = false;
    } catch (error) {
      console.error("=>", error);
      this.showAnimationError();
    }
  }

  showLoadingAnimation() {
    const canvas = document.getElementById('map');
    const playgroundOptions = document.getElementById('playground-options');

    if (canvas && playgroundOptions) {
      this.renderer.addClass(canvas, 'ion-hide');
      this.renderer.addClass(playgroundOptions, 'ion-hide');
      this.stopLoadingMap = false;
    }
  }

  showAnimation() {
    const canvas = document.getElementById('map');
    const playgroundOptions = document.getElementById('playground-options');

    if (canvas && playgroundOptions) {
      this.renderer.removeClass(canvas, 'ion-hide');
      this.renderer.removeClass(playgroundOptions, 'ion-hide');
      this.stopLoadingMap = true;
    }
  }

  showAnimationError() {
    const playground = document.getElementById('playground');
    if (playground) {
      this.renderer.addClass(playground, 'ion-hide');
      this.showMapError = true;
    }
  }

  async toggleFullScreenMap() {
    if (!this.isWebPlatform) { // this behavior is only avaliable for native devices.
      this.isFullscreen = !this.isFullscreen;

      const contentDirectory = document.getElementById('content-directory');
      const headerMap = document.getElementById('header-map');

      if (this.isFullscreen) { // show Fullscreen mode
        await this.screenSrvc.lockOrientation(this.screen.ORIENTATIONS.LANDSCAPE);

        if (contentDirectory && headerMap) {
          this.renderer.addClass(contentDirectory, 'ion-hide');
          this.renderer.addClass(headerMap, 'fullscreen');

          Object.keys(this.NORMALLY_SIZES)
            .forEach(key => this.renderer.setAttribute(headerMap, key, '12'));
        }
      } else { // show Normal view
        if (this.screenSrvc.currentOrientation.includes('portrait')) {
          await this.screenSrvc.lockOrientation(this.screen.ORIENTATIONS.PORTRAIT);
        }

        if (contentDirectory && headerMap) {
          this.renderer.removeClass(contentDirectory, 'ion-hide');
          this.renderer.removeClass(headerMap, 'fullscreen');

          Object.entries(this.NORMALLY_SIZES)
            .forEach(([key, val]) => this.renderer.setAttribute(headerMap, key, val));
        }
        this.screenSrvc.unlockOrientation();
      }
    }
  }

}
