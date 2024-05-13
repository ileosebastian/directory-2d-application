import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { KeyValuePipe, NgFor, NgIf } from '@angular/common';

import { Subscription } from 'rxjs';
import { IonContent, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonSearchbar, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { layers } from 'ionicons/icons';

import { PlaceController } from '../../../../../../core/place/infraestructure/place.controller';
import { MapController } from '../../../../../../core/map/infraestructure/map.controller';
import { NetworkService } from 'src/app/views/shared/services/network/network.service';

import { FilterPointsAndCategoryPipe } from '../../../../../detail/pipes/filter-points-and-category.pipe';

import { Entry } from '../../../../../../core/map/domain/entry.domain';
import { Place } from '../../../../../../core/place/domain/place.domain';
import { ENTRY_CATEGORY_KEY } from '../../../../../../core/shared/data/constants.data';
import { Plane } from '../../../../../../core/map/domain/plane.domain';


@Component({
  selector: 'app-place-selector',
  templateUrl: './place-selector.component.html',
  styleUrls: ['./place-selector.component.scss'],
  standalone: true,
  imports: [
    IonSearchbar,
    IonContent,
    IonList,
    IonItemGroup,
    IonItemDivider,
    IonLabel,
    IonItem,
    IonIcon,
    IonSpinner,
    NgIf,
    NgFor,
    KeyValuePipe,
    FilterPointsAndCategoryPipe
  ],
})
export class PlaceSelectorComponent implements OnInit, OnDestroy {

  @Input() role!: 'start' | 'goal';
  @Input() facultyName!: string;
  @Input() plans!: Plane[];

  @Output() emittStart = new EventEmitter<Entry | Place>();
  @Output() emittGoal = new EventEmitter<Place>();

  searchText: string = '';

  PLACES!: { [key: string]: Place[] };
  @Input() isEmptyList: boolean = false;
  ENTRIES!: { [key: string]: Entry[] };

  private isOnlineMode: boolean;

  private networkSrvc = inject(NetworkService);

  private placeCtrl = inject(PlaceController);
  private mapCtrl = inject(MapController);

  private suscriptorOnlineMode: Subscription;

  constructor() {
    this.isOnlineMode = this.networkSrvc.isOnline.value;

    addIcons({ layers });

    this.suscriptorOnlineMode = this.networkSrvc.isOnline
      .subscribe(async isOnline => {
        this.isOnlineMode = isOnline;
      });
  }

  async ngOnInit() {
    this.searchText = '';
    this.ENTRIES = {};

    if (this.role === 'start') {
      this.ENTRIES[ENTRY_CATEGORY_KEY] = this.mapCtrl.getEntriesByPlans(this.plans);
    }
    this.PLACES = await this.placeCtrl.getTotalPlacesByFaculty(this.isOnlineMode, this.facultyName);

    this.isEmptyList = Object.keys(this.PLACES).length > 0;
  }

  ngOnDestroy(): void {
    this.suscriptorOnlineMode.unsubscribe();
  }

  getCorrectIconReference(category: string) {
    if (category === 'stair-horizontal' || category === 'stair-vertical') { // magic strings (?)
      return 'stair';
    }
    return category;
  }

  search(event: any) {
    this.searchText = event.target.value.toLowerCase();
  }

  selectEntry(entry: Entry) {
    this.emittStart.emit(entry);
  }

  selectPlace(place: Place) {
    if (this.role === 'start') {
      this.emittStart.emit(place);
    }

    if (this.role === 'goal') {
      this.emittGoal.emit(place);
    }
  }

}
