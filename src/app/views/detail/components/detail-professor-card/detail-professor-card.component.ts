import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { IonAvatar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/angular/standalone';

import { AllDetailsProfessor } from 'src/app/core/professor/domain/professor.domain';

import { toUpperCaseFirstChar } from '../../../shared/utils/uppercase-first-char.utils';


@Component({
  selector: 'app-detail-professor-card',
  templateUrl: './detail-professor-card.component.html',
  styleUrls: ['./detail-professor-card.component.scss'],
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
export class DetailProfessorCardComponent implements OnInit {

  @Input() professor!: AllDetailsProfessor;

  async ngOnInit() {}

  upperCaseFirstChar(text: string) {
    return toUpperCaseFirstChar(text);
  }

}
