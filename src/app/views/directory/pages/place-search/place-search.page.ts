import { Component, OnDestroy, OnInit, WritableSignal, effect, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

import { IonCol, IonContent, IonGrid, IonRow } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';

import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FacultyListComponent } from '../../components/faculty-list/faculty-list.component';
import { FilterPlacesFabComponent } from '../../components/filter-places-fab/filter-places-fab.component';
import { LoadingCardListComponent } from '../../components/loading-card-list/loading-card-list.component';
import { ContentCardListComponent } from '../../components/content-card-list/content-card-list.component';
import { InifiniteScrollItemListComponent } from '../../components/inifinite-scroll-item-list/inifinite-scroll-item-list.component';
import { MessageCenteredComponent } from '../../../shared/components/message-centered/message-centered.component';

import { PlaceController } from '../../../../core/place/infraestructure/place.controller';
import { UniversityController } from '../../../../core/university/infraestructure/university.cotroller';
import { NetworkService } from 'src/app/views/shared/services/network/network.service';

import { Place } from '../../../../core/place/domain/place.domain';
import { ALL_FACULTIES_KEY } from '../../../../core/shared/data/constants.data';

import { getNameByCategory } from '../../../shared/utils/get-name-by-category';
import { ReloadDataService } from 'src/app/views/shared/services/reload-data.service';


@Component({
  selector: 'app-place-search',
  templateUrl: './place-search.page.html',
  styleUrls: ['./place-search.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    NgIf,
    NgFor,
    HeaderComponent,
    FacultyListComponent,
    ContentCardListComponent,
    LoadingCardListComponent,
    MessageCenteredComponent,
    InifiniteScrollItemListComponent,
    FilterPlacesFabComponent
  ]
})
export class PlaceSearchPage implements OnInit, OnDestroy {

  campus!: string;
  isCampus!: boolean;
  faculty!: string;

  isSearching!: boolean;
  placeName: string = '';

  category!: string;
  places: Place[] = [];

  thereAreNotData!: boolean;

  private isOnlineMode: boolean;

  private networkSrvc = inject(NetworkService);

  private universityCtrl = inject(UniversityController);
  private router = inject(Router);
  private placeCtrl = inject(PlaceController);
  private reloadDataSrvc = inject(ReloadDataService);

  private universitySuscription!: Subscription;
  private suscriptorOnlineMode: Subscription;

  private isFistTimeToShow: boolean;
  private isReload: WritableSignal<boolean>;

  constructor() {
    this.isReload = this.reloadDataSrvc.getIsReload();

    this.isSearching = false;
    this.campus = this.universityCtrl.getCurrentCampus();

    this.isOnlineMode = this.networkSrvc.isOnline.value;

    this.isCampus = true;
    this.thereAreNotData = false;

    this.isFistTimeToShow = true;

    this.suscriptorOnlineMode = this.networkSrvc.isOnline
      .subscribe(async isOnline => {
        this.isOnlineMode = isOnline;

        if (!this.isFistTimeToShow) {
          this.places = [];
          await this.showPlaces(
            this.isCampus,
            this.isCampus ? this.campus : this.faculty,
            this.category,
            this.isSearching,
            this.placeName,
            true
          );
        }

      });

    effect(async () => {

      if (this.isReload()) {
        this.places = [];
        this.isCampus = true;
        this.isSearching = false;
        this.thereAreNotData = false;
        this.campus = this.universityCtrl.getCurrentCampus();
        this.isFistTimeToShow = true;

        await this.showPlaces(
          this.isCampus,
          this.isCampus ? this.campus : this.faculty,
          this.category,
          this.isSearching,
          this.placeName,
          true
        );

        this.isFistTimeToShow = false;
      }

    });
  }

  async ngOnInit() {
    this.category = <string>this.router.url.split('/').pop();
    await this.showPlaces(
      this.isCampus,
      this.isCampus ? this.campus : this.faculty,
      this.category,
      this.isSearching,
      this.placeName,
      false
    );

    this.universitySuscription = this.universityCtrl.currentCampus
      .subscribe(async campus => {
        this.campus = campus;
        this.isCampus = true;

        if (!this.isFistTimeToShow) {
          this.places = [];
          await this.showPlaces(
            this.isCampus,
            this.isCampus ? this.campus : this.faculty,
            this.category,
            this.isSearching,
            this.placeName,
            true
          );
        }

      });

    this.isFistTimeToShow = false;
  }

  ngOnDestroy(): void {
    this.places = [];
    if (this.universitySuscription) this.universitySuscription.unsubscribe();
    this.suscriptorOnlineMode.unsubscribe();
  }

  getNameByCat(name: string) {
    return getNameByCategory(name);
  }

  async listenSearchText(textName: string) {
    this.places = [];
    this.placeName = textName.toLowerCase();
    this.isSearching = true;

    if (textName === '' || textName.length === 0) {
      await this.showPlaces(
        this.isCampus,
        this.isCampus ? this.campus : this.faculty,
        this.category,
        false,
        this.placeName,
        false
      );
      return;
    }

    await this.showPlaces(
      this.isCampus,
      this.isCampus ? this.campus : this.faculty,
      this.category,
      this.isSearching,
      this.placeName,
      false
    );
  }

  async cancelSearch(ev: boolean) {
    this.isSearching = false;
    this.placeName = '';

    await this.showPlaces(
      this.isCampus,
      this.isCampus ? this.campus : this.faculty,
      this.category,
      this.isSearching,
      this.placeName,
      false
    );
  }

  async listenFacuName(facultyName: string) {
    this.faculty = facultyName;
    this.isCampus = facultyName === ALL_FACULTIES_KEY;
    this.places = [];

    await this.showPlaces(
      this.isCampus,
      this.isCampus ? this.campus : this.faculty,
      this.category,
      this.isSearching,
      this.placeName,
      false
    );
  }

  private async showPlaces(isCampus: boolean, value: string, category: string, isSearching: boolean, name: string = '', isReload: boolean) {
    let places: Place[] = [];
    if (isCampus && isSearching) { // is looking for a specific professors by campus
      places = await this.placeCtrl.searchPlacesByName(this.isOnlineMode, ALL_FACULTIES_KEY, value, category, name);
    }

    if (isCampus && !isSearching) { // is searching all professors by campus
      places = await this.placeCtrl.searchAllPlaces(this.isOnlineMode, ALL_FACULTIES_KEY, value, category, undefined, isReload);
    }

    if (isSearching && !isCampus) { // is looking for a specific professors by faculty
      places = await this.placeCtrl.searchPlacesByName(this.isOnlineMode, this.faculty, value, category, name);
    }

    if (!isCampus && !isSearching) {    // is searching all professors by faculty
      places = await this.placeCtrl.searchAllPlaces(this.isOnlineMode, this.faculty, value, category, undefined, isReload);
    }

    this.thereAreNotData = places.length === 0;
    this.places = places;
  }

}
