import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { IonAvatar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/angular/standalone';

import { AllDetailsPlace } from '../../../../core/place/domain/place.domain';

import { toUpperCaseFirstChar } from '../../../shared/utils/uppercase-first-char.utils';
import { getNameByCategory } from '../../../shared/utils/get-name-by-category';


@Component({
  selector: 'app-detail-place-card',
  templateUrl: './detail-place-card.component.html',
  styleUrls: ['./detail-place-card.component.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonAvatar,
    IonCardSubtitle,
    IonCardContent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailPlaceCardComponent implements OnInit {

  @Input() place!: AllDetailsPlace;

  ngOnInit() { }

  upperCaseFirstChar(text: string) {
    return toUpperCaseFirstChar(text);
  }

  getNameCat(name: string) {
    return getNameByCategory(name);
  }

}
