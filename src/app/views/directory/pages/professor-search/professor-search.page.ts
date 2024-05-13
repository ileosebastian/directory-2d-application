import { Component, OnInit, inject, OnDestroy, WritableSignal, effect } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';

import { Subscription } from 'rxjs';

import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FacultyListComponent } from '../../components/faculty-list/faculty-list.component';
import { LoadingCardListComponent } from '../../components/loading-card-list/loading-card-list.component';
import { ContentCardListComponent } from '../../components/content-card-list/content-card-list.component';
import { InifiniteScrollItemListComponent } from '../../components/inifinite-scroll-item-list/inifinite-scroll-item-list.component';
import { MessageCenteredComponent } from '../../../shared/components/message-centered/message-centered.component';

import { ProfessorController } from '../../../../core/professor/infraestructure/professor.controller';
import { UniversityController } from 'src/app/core/university/infraestructure/university.cotroller';
import { NetworkService } from 'src/app/views/shared/services/network/network.service';

import { Professor } from '../../../../core/professor/domain/professor.domain';
import { ALL_FACULTIES_KEY } from '../../../../core/shared/data/constants.data';
import { IonCol, IonContent, IonGrid, IonRow } from '@ionic/angular/standalone';
import { ReloadDataService } from 'src/app/views/shared/services/reload-data.service';


@Component({
  selector: 'app-professor-search',
  templateUrl: './professor-search.page.html',
  styleUrls: ['./professor-search.page.scss'],
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
    MessageCenteredComponent,
    LoadingCardListComponent,
    InifiniteScrollItemListComponent
  ],
})
export class ProfessorSearchPage implements OnInit, OnDestroy {

  campus!: string;
  isCampus!: boolean;
  faculty!: string;

  isSearching!: boolean;
  thereAreNotData!: boolean;

  professors: Professor[] = [];
  profeName: string = '';

  private isOnlineMode: boolean;

  private networkSrvc = inject(NetworkService);

  private universityCtrl = inject(UniversityController);
  private profeCtrl = inject(ProfessorController);
  private reloadDataSrvc = inject(ReloadDataService);

  private universitySuscription!: Subscription;
  private suscriptorOnlineMode: Subscription;

  private isFistTimeToShow: boolean;
  private isReload: WritableSignal<boolean>;

  constructor() {
    this.isReload = this.reloadDataSrvc.getIsReload();
    this.isOnlineMode = this.networkSrvc.isOnline.value;

    this.isCampus = true;
    this.isSearching = false;
    this.thereAreNotData = false;
    this.campus = this.universityCtrl.getCurrentCampus();
    this.isFistTimeToShow = true;

    this.suscriptorOnlineMode = this.networkSrvc.isOnline
      .subscribe(async isOnline => {
        this.isOnlineMode = isOnline;

        if (!this.isFistTimeToShow) {
          this.professors = [];
          await this.showProfessors(
            this.isCampus,
            this.isCampus ? this.campus : this.faculty,
            this.isSearching,
            this.profeName,
            true
          );
        }

      });

    effect(async () => {

      if (this.isReload()) {
        this.professors = [];
        this.isCampus = true;
        this.isSearching = false;
        this.thereAreNotData = false;
        this.campus = this.universityCtrl.getCurrentCampus();
        this.isFistTimeToShow = true;

        await this.showProfessors(
          this.isCampus,
          this.isCampus ? this.campus : this.faculty,
          this.isSearching,
          this.profeName,
          true
        );

        this.isFistTimeToShow = false;
      }

    });
  }

  async ngOnInit() {
    await this.showProfessors(
      this.isCampus,
      this.isCampus ? this.campus : this.faculty,
      this.isSearching,
      this.profeName,
      false
    );

    this.universitySuscription = this.universityCtrl.currentCampus
      .subscribe(async campus => {
        this.campus = campus;

        if (!this.isFistTimeToShow) {
          this.professors = [];
          this.isCampus = true;
          await this.showProfessors(
            this.isCampus,
            this.isCampus ? this.campus : this.faculty,
            this.isSearching,
            this.profeName,
            true
          );
        }

      });

    this.isFistTimeToShow = false;
  }

  ngOnDestroy(): void {
    this.professors = [];
    if (this.universitySuscription) this.universitySuscription.unsubscribe();
    this.suscriptorOnlineMode.unsubscribe();
  }

  async listenSearchText(textName: string) {
    this.professors = [];
    this.profeName = textName.toLowerCase();
    this.isSearching = true;

    if (textName === '' || textName.length === 0) {
      await this.showProfessors(
        this.isCampus,
        this.isCampus ? this.campus : this.faculty,
        false, // to search all professors if professor name text is nothing
        this.profeName,
        false
      );
      return;
    }

    await this.showProfessors(
      this.isCampus,
      this.isCampus ? this.campus : this.faculty,
      this.isSearching, // procedure to search professors
      this.profeName,
      false
    );
  }

  async cancelSearch(ev: boolean) {
    this.isSearching = false;
    this.profeName = '';

    await this.showProfessors(
      this.isCampus,
      this.isCampus ? this.campus : this.faculty,
      this.isSearching,
      this.profeName,
      false
    );
  }

  async listenFacuName(facultyName: string) {
    this.faculty = facultyName;
    this.isCampus = facultyName === ALL_FACULTIES_KEY;
    this.professors = [];

    await this.showProfessors(
      this.isCampus,
      this.isCampus ? this.campus : this.faculty,
      this.isSearching,
      this.profeName,
      false
    );
  }

  private async showProfessors(isCampus: boolean, value: string, isSearching: boolean, name: string = '', isReload: boolean) {
    let profes: Professor[] = [];
    if (isCampus && isSearching) { // is looking for a specific professors by campus
      profes = await this.profeCtrl.searchProfessorByName(this.isOnlineMode, ALL_FACULTIES_KEY, value, name);
    }

    if (isCampus && !isSearching) { // is searching all professors by campus
      profes = await this.profeCtrl.searchAllProfessors(this.isOnlineMode, ALL_FACULTIES_KEY, value, undefined, isReload);
    }

    if (isSearching && !isCampus) { // is looking for a specific professors by faculty
      profes = await this.profeCtrl.searchProfessorByName(this.isOnlineMode, this.faculty, value, name);
    }

    if (!isCampus && !isSearching) {    // is searching all professors by faculty
      profes = await this.profeCtrl.searchAllProfessors(this.isOnlineMode, this.faculty, value, undefined, isReload);
    }

    this.thereAreNotData = profes.length === 0;
    this.professors = profes;
  }

}
