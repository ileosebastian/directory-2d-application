import { Component, OnDestroy, OnInit, WritableSignal, effect, inject } from '@angular/core';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';

import { Subscription } from 'rxjs';
import { IonCol, IonContent, IonGrid, IonRow } from '@ionic/angular/standalone';

import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { MessageCenteredComponent } from '../../../shared/components/message-centered/message-centered.component';

import { ProfessorController } from '../../../../core/professor/infraestructure/professor.controller';
import { PlaceController } from '../../../../core/place/infraestructure/place.controller';
import { UniversityController } from 'src/app/core/university/infraestructure/university.cotroller';

import { Place } from '../../../../core/place/domain/place.domain';
import { Professor } from '../../../../core/professor/domain/professor.domain';
import { ContentCardListComponent } from '../../components/content-card-list/content-card-list.component';
import { LoadingCardListComponent } from '../../components/loading-card-list/loading-card-list.component';

import { ALL_FACULTIES_KEY, PLACE_SEARCH_KEY } from '../../../../core/shared/data/constants.data';
import { NetworkService } from 'src/app/views/shared/services/network/network.service';
import { ReloadDataService } from 'src/app/views/shared/services/reload-data.service';


@Component({
  selector: 'app-general-search',
  templateUrl: './general-search.page.html',
  styleUrls: ['./general-search.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    NgIf,
    NgFor,
    TitleCasePipe,
    HeaderComponent,
    SearchBarComponent,
    MessageCenteredComponent,
    ContentCardListComponent,
    LoadingCardListComponent
  ]
})
export class GeneralSearchPage implements OnInit, OnDestroy {

  campus!: string;

  isSearching!: boolean;
  thereAreNotData!: boolean;

  searchText!: string;

  places: Place[] = [];
  professors: Professor[] = [];

  private isOnlineMode: boolean;

  private networkSrvc = inject(NetworkService);

  private universityCtrl = inject(UniversityController);

  private professorCtrl = inject(ProfessorController);
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

    this.isFistTimeToShow = true;

    this.suscriptorOnlineMode = this.networkSrvc.isOnline
      .subscribe(async isOnline => {
        this.isOnlineMode = isOnline;

        if (!this.isFistTimeToShow) {
          this.places = [];
          this.professors = [];
          await this.showItems(
            PLACE_SEARCH_KEY,
            this.searchText
          );
        }

      });

    effect(() => {
      if (this.isReload()) {
        this.places = [];
        this.professors = [];

        this.isSearching = false;
        this.thereAreNotData = false;
        this.campus = this.universityCtrl.getCurrentCampus();
        this.isFistTimeToShow = true;
        this.searchText = '';
      }
    });
  }

  ngOnInit() {
    this.universitySuscription = this.universityCtrl.currentCampus
      .subscribe(campus => {
        this.campus = campus;
      });

    this.isFistTimeToShow = false;
  }

  ngOnDestroy(): void {
    this.places = [];
    this.professors = [];
    if (this.universitySuscription) this.universitySuscription.unsubscribe();
    this.suscriptorOnlineMode.unsubscribe();
  }

  async listenSearchText(searchText: string) {
    this.searchText = searchText.toLowerCase();
    this.isSearching = true;
    this.thereAreNotData = false;
    this.places = [];
    this.professors = [];

    if (searchText.replace(/\s/g, "").length === 0) {
      this.isSearching = false;
      return;
    }

    await this.showItems(
      PLACE_SEARCH_KEY,
      this.searchText
    );
  }

  cancelSearching() {
    this.isSearching = false;
    this.thereAreNotData = false;
    this.places = [];
    this.professors = [];
  }

  private async showItems(category: string, name: string = '') {
    let places: Place[] = [];
    let professors: Professor[] = [];
    places = await this.placeCtrl.searchPlacesByName(this.isOnlineMode, ALL_FACULTIES_KEY, this.campus, category, name);
    professors = await this.professorCtrl.searchProfessorByName(this.isOnlineMode, ALL_FACULTIES_KEY, this.campus, name);

    this.thereAreNotData = places.length === 0 && professors.length === 0;
    this.places = places;
    this.professors = professors;
  }

}
