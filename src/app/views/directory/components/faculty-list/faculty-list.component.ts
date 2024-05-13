import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, Input, inject, Output, EventEmitter, OnDestroy, ViewChild, WritableSignal, effect, Injectable, EnvironmentInjector } from '@angular/core';

import { IonLabel, IonSegment, IonSegmentButton, IonSkeletonText } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';

import { UniversityController } from '../../../../core/university/infraestructure/university.cotroller';

import { Faculty } from '../../../../core/university/domain/faculty.domain';
import { ALL_FACULTIES_KEY } from '../../../../core/shared/data/constants.data';
import { AllFaculties, CampusPermitted } from '../../../../core/shared/models/core.types';
import { NetworkService } from 'src/app/views/shared/services/network/network.service';
import { ReloadDataService } from 'src/app/views/shared/services/reload-data.service';


@Component({
  selector: 'app-faculty-list',
  templateUrl: './faculty-list.component.html',
  styleUrls: ['./faculty-list.component.scss'],
  standalone: true,
  imports: [
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSkeletonText,
    NgIf,
    NgFor
  ],
})
export class FacultyListComponent implements OnInit, OnDestroy {

  @Input() categoryColor!: string;
  @Output() emittFacultyName = new EventEmitter<AllFaculties | string>;

  @ViewChild('segmentList') segments!: IonSegment;

  ALL_FACULTIES = ALL_FACULTIES_KEY;
  faculties: Faculty[] = [];

  showListError: boolean = false;
  isOnlineMode: boolean;

  private universitySuscription!: Subscription;

  private networkSrvc = inject(NetworkService);
  private uniController = inject(UniversityController);
  private reloadDataSrvc = inject(ReloadDataService);

  private suscriptorOnlineMode: Subscription;

  private isFistTimeToShow: boolean;
  private isReload: WritableSignal<boolean>;

  constructor() {
    this.isReload = this.reloadDataSrvc.getIsReload();

    this.isOnlineMode = this.networkSrvc.isOnline.value;
    this.isFistTimeToShow = true;

    this.suscriptorOnlineMode = this.networkSrvc.isOnline.subscribe(async isOnline => {
      this.isOnlineMode = isOnline;

      if (!this.isFistTimeToShow)
        await this.generateFacultyList(this.uniController.getCurrentCampus());
    });

    effect(async () => {

      if (this.isReload()) {
        if (this.segments)
          this.segments.value = ALL_FACULTIES_KEY;
        await this.generateFacultyList(this.uniController.getCurrentCampus());
      }

    });
  }

  async ngOnInit() {
    await this.generateFacultyList(this.uniController.getCurrentCampus());

    this.universitySuscription = this.uniController.currentCampus
      .subscribe(async campus => {
        if (this.segments)
          this.segments.value = ALL_FACULTIES_KEY;

        if (!this.isFistTimeToShow) {
          await this.generateFacultyList(campus);
        }

      });

    this.isFistTimeToShow = false;
  }

  ngOnDestroy(): void {
    this.universitySuscription.unsubscribe();
    this.suscriptorOnlineMode.unsubscribe();
  }

  private async generateFacultyList(campus: CampusPermitted) {
    try {
      this.faculties = [];
      this.faculties = await this.uniController.getFacultyListByCampus(campus, this.isOnlineMode);
      this.showListError = !this.faculties || this.faculties.length === 0;
    } catch (error) {
      this.showListError = true;
      console.error("=>", error);
    }
  }

  async onChangeSegment(event: any) {
    this.emittFacultyName.emit(event.detail.value);
  }

}
