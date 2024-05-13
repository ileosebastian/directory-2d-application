import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, inject } from '@angular/core';

import { Subscription } from 'rxjs';
import { IonButton, IonIcon, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisVertical, locationOutline } from 'ionicons/icons';

import { PlaceSelectorComponent } from '../place-selector/place-selector.component';
import { PlaceController } from '../../../../../../core/place/infraestructure/place.controller';
import { NetworkService } from 'src/app/views/shared/services/network/network.service';

import { AllDetailsPlace, Place } from '../../../../../../core/place/domain/place.domain';
import { Entry } from '../../../../../../core/map/domain/entry.domain';
import { Plane } from '../../../../../../core/map/domain/plane.domain';
import { UUID } from '../../../../../../core/shared/models/core.types';
import { ENTRY_FIRST_FLOOR_TITLE } from '../../../../../../core/shared/data/constants.data';
import { Tour } from '../../../../../shared/models/tour.interface';

import { isAPlace } from '../../../../../../core/shared/utils/is-a-place.util';
import { isAnEntry } from '../../../../../../core/shared/utils/is-an-entry.util';


@Component({
  selector: 'app-location-selector',
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonModal,
    PlaceSelectorComponent
  ],
})
export class LocationSelectorComponent implements OnInit, OnDestroy {

  @Input() originItem!: Entry | Place | null;
  @Input() destinyItem!: AllDetailsPlace;
  @Input() plans: Plane[] = [];
  @Output() emittNewTour = new EventEmitter<Tour>();
  @Output() emittCloseDialog = new EventEmitter();

  startTitle!: string;
  startPlaceSelected!: Entry | Place;

  destinyTitle!: string;
  goalPlaceSelected!: Place;

  isOpen: boolean = false;
  statePlace!: 'start' | 'goal';

  facultyName!: string;

  private isOnlineMode: boolean;

  private networkSrvc = inject(NetworkService);

  private renderer = inject(Renderer2);
  private placeCtrl = inject(PlaceController);

  private suscriptorOnlineMode: Subscription;

  constructor() {
    this.isOnlineMode = this.networkSrvc.isOnline.value;

    addIcons({ ellipsisVertical, locationOutline });

    this.suscriptorOnlineMode = this.networkSrvc.isOnline
      .subscribe(async isOnline => {
        this.isOnlineMode = isOnline;
      });
  }

  async ngOnInit() {
    this.startTitle = this.originItem ? this.originItem.title : ENTRY_FIRST_FLOOR_TITLE;
    this.destinyTitle = this.destinyItem.title;
    this.facultyName = this.destinyItem.faculty;

    const dialog = document.getElementById('dialog-location');
    if (dialog) {
      this.renderer.removeClass(dialog, 'ion-hide');
      this.renderer.removeClass(dialog, 'hide-dialog');
      this.renderer.addClass(dialog, 'show-dialog');
    }
  }

  ngOnDestroy(): void {
    this.suscriptorOnlineMode.unsubscribe();
  }

  async openPlaceSelectorByRole(role: 'start' | 'goal') {
    this.isOpen = true;
    this.statePlace = role;
  }

  listenStart(start: Entry | Place) {
    this.isOpen = false; // close modal
    this.startPlaceSelected = start;
    this.startTitle = start.title;
  }

  listenGoal(goal: Place) {
    this.isOpen = false; // close modal
    this.goalPlaceSelected = goal;
    this.destinyTitle = goal.title || goal.name + ' ' + goal.code;
  }

  async generateTour() {
    let startId: UUID | null = null;
    let goalId: UUID = this.destinyItem.wayPointId;
    const origin: Entry | Place | null = this.startPlaceSelected ?? this.originItem;
    let destiny: AllDetailsPlace = this.destinyItem;

    if (origin && isAPlace(origin)) {
      startId = origin.wayPointId;
    } else if (origin && isAnEntry(origin)) {
      startId = origin.waypointId;
    }

    if (this.goalPlaceSelected) {
      const place = await this.placeCtrl.getAllDetailsPlaceById(this.isOnlineMode, this.goalPlaceSelected.uuid);
      goalId = place.wayPointId;
      destiny = place;
    }

    this.emittNewTour.emit({ startId, goalId, origin, destiny });
    await this.closeDialog();
  }

  async closeDialog() {
    const dialog = document.getElementById('dialog-location');

    if (dialog) {
      this.renderer.removeClass(dialog, 'show-dialog');
      this.renderer.addClass(dialog, 'hide-dialog');

      setTimeout(() => {
        this.renderer.addClass(dialog, 'ion-hide');
        this.emittCloseDialog.emit();
      }, 600);
    }
  }

}
