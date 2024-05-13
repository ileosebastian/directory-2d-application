import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonAvatar, IonCard, IonCardContent, IonCardHeader, IonSkeletonText } from '@ionic/angular/standalone';


@Component({
  selector: 'app-loading-card-detail',
  templateUrl: './loading-card-detail.component.html',
  styleUrls: ['./loading-card-detail.component.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonCardHeader,
    IonSkeletonText,
    IonAvatar,
    IonCardContent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingCardDetailComponent { }
