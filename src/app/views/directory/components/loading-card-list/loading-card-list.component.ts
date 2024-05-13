import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonAvatar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonSkeletonText } from '@ionic/angular/standalone';


@Component({
  selector: 'app-loading-card-list',
  templateUrl: './loading-card-list.component.html',
  styleUrls: ['./loading-card-list.component.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonItem,
    IonAvatar,
    IonSkeletonText,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingCardListComponent {}
