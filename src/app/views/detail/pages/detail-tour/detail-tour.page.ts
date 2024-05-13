import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';

import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonLabel, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { Subscription } from 'rxjs';

import { TourComponent } from '../../components/tour/tour.component';
import { DetailProfessorCardComponent } from '../../components/detail-professor-card/detail-professor-card.component';
import { DetailPlaceCardComponent } from '../../components/detail-place-card/detail-place-card.component';
import { LoadTourComponent } from '../../components/load-tour/load-tour.component';
import { LoadingCardDetailComponent } from '../../components/loading-card-detail/loading-card-detail.component';
import { MessageCenteredComponent } from '../../../shared/components/message-centered/message-centered.component';

import { ProfessorController } from '../../../../core/professor/infraestructure/professor.controller';
import { PlaceController } from '../../../../core/place/infraestructure/place.controller';
import { ScreenOrientationService } from '../../../shared/services/screen-orientation/screen-orientation.service';

import { ScopeFilter, UUID } from '../../../../core/shared/models/core.types';
import { AllDetailsProfessor } from '../../../../core/professor/domain/professor.domain';
import { AllDetailsPlace } from '../../../../core/place/domain/place.domain';
import { NetworkService } from 'src/app/views/shared/services/network/network.service';


@Component({
  selector: 'app-detail-tour',
  templateUrl: './detail-tour.page.html',
  styleUrls: ['./detail-tour.page.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonLabel,

    NgIf,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,

    TourComponent,
    LoadTourComponent,
    DetailProfessorCardComponent,
    DetailPlaceCardComponent,
    LoadingCardDetailComponent,
    MessageCenteredComponent
  ],
})
export class DetailTourPage implements OnInit, OnDestroy {

  @Input() id!: UUID | string;
  @Input() colorCategory!: string;

  @Output() emittCancelation = new EventEmitter<boolean>();

  professor!: AllDetailsProfessor;
  professors: AllDetailsProfessor[] = [];
  place!: AllDetailsPlace;

  itemType!: ScopeFilter;

  showNotFoundError: boolean = false;
  showMapError: boolean = false;

  isOnlineMode: boolean;

  private networkSrvc = inject(NetworkService);
  private screenService = inject(ScreenOrientationService);
  private professorCtrl = inject(ProfessorController);
  private placeCtrl = inject(PlaceController);

  private suscriptorOnlineMode: Subscription;

  constructor() {
    this.isOnlineMode = this.networkSrvc.isOnline.value;

    addIcons({ arrowBack });

    this.suscriptorOnlineMode = this.networkSrvc.isOnline
      .subscribe(async isOnline => {
        this.isOnlineMode = isOnline;
      });
  }

  async ngOnInit() {
    this.screenService.execute();

    const parsedId = this.id.split('-');

    try {
      if (parsedId.length > 1) { // is place
        this.place = await this.placeCtrl.getAllDetailsPlaceById(this.isOnlineMode, this.id as UUID);
        if (this.place.belongsProfessor) {
          this.professors = await this.professorCtrl.getDetailProfessorsByIdList(this.isOnlineMode, this.place.professorsId);
        }
        this.itemType = 'place';
      } else { // is professor
        this.professor = await this.professorCtrl.getAllDetailsProfessorById(this.isOnlineMode, this.id);
        this.place = await this.placeCtrl.getAllDetailsPlaceByOffice(this.isOnlineMode, this.professor.office);
        this.itemType = 'professor';
      }
    } catch (error) {
      this.showNotFoundError = true;
      this.showMapError = true;
      console.error("=>", error);
    }
  }

  ngOnDestroy(): void {
    this.screenService.unsuscribeChange();
    this.screenService.unlockOrientation();
    this.suscriptorOnlineMode.unsubscribe();
  }

  getCorrectReference(category: string) {
    if (category === 'stair-horizontal' || category === 'stair-vertical') {
      return 'stair';
    }
    return category;
  }

  async showNewDetailTour(destinyPlace: AllDetailsPlace) {
    try {
      this.place = destinyPlace;
      this.colorCategory = this.place.category;
      if (this.place.belongsProfessor) {
        this.professors = await this.professorCtrl.getDetailProfessorsByIdList(this.isOnlineMode, this.place.professorsId);
      }
      this.itemType = 'place';
    } catch (error) {
      this.showNotFoundError = true;
      this.showMapError = true;
      console.error("=>", error);
    }
  }

  listenPlaceToShow(place: AllDetailsPlace) {
    this.place = place;
  }

  cancelModal() {
    this.emittCancelation.emit(false);
  }

}
