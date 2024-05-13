import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';

import { IonModal as Modal } from '@ionic/angular';
import { IonAvatar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonModal } from '@ionic/angular/standalone';

import { DetailTourPage } from '../../../detail/pages/detail-tour/detail-tour.page';

import { Professor } from '../../../../core/professor/domain/professor.domain';
import { Place } from '../../../../core/place/domain/place.domain';
import { PROFESSOR_SEARCH_KEY } from '../../../../core/shared/data/constants.data';

import { isAProfessor } from '../../../../core/shared/utils/is-a-professor.util';
import { UUID } from '../../../../core/shared/models/core.types';
import { TourService } from 'src/app/views/shared/services/tour.service';


@Component({
  selector: 'app-content-card-list',
  templateUrl: './content-card-list.component.html',
  styleUrls: ['./content-card-list.component.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonItem,
    IonAvatar,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonModal,
    DetailTourPage
  ],
})
export class ContentCardListComponent implements OnInit {

  @Input() item!: Professor | Place;

  @ViewChild(IonModal) modal!: Modal;

  isModalOpen = false;
  id!: UUID | string;
  color: string = 'secondary';

  private tourService = inject(TourService);

  ngOnInit() { }

  openTour(isOpen: boolean, item: Professor | Place) {
    this.isModalOpen = isOpen;

    if (isAProfessor(item)) {
      this.id = item.id;
      this.color = PROFESSOR_SEARCH_KEY;
    } else {
      this.id = item.uuid;
      this.color = item.category;
    }

    this.tourService.setTourParams(this.id, this.color);
    this.tourService.setIsActiveTour(true);
  }

  getImageName(item: Professor | Place): string {
    return isAProfessor(item) ? 'professor' : item.category;
  }

  getTitleCard(item: Professor | Place): string {
    return isAProfessor(item) ? item.name :
      item.title ? item.title : (item.name + ' ' + item.code);
  }

}
