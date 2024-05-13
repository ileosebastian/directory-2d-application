import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, effect, WritableSignal, inject } from '@angular/core';
import { NgIf } from '@angular/common';

import { IonButton, IonButtons, IonHeader, IonIcon, IonMenuToggle, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { optionsSharp, searchSharp } from 'ionicons/icons';

import { SearchBarComponent } from '../search-bar/search-bar.component';

import { GENERAL_SEARCH_KEY } from '../../../../core/shared/data/constants.data';
import { ReloadDataService } from '../../services/reload-data.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuToggle,
    IonButton,
    IonIcon,
    IonTitle,
    NgIf,
    SearchBarComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

  @Input() title: string = "Directorio 2D";
  @Input() colorByCategory: string = 'light';
  @Input() categoryName: string = '';

  @Output() emmitSearchText = new EventEmitter<string>();
  @Output() emmitCancelEvent = new EventEmitter<boolean>();

  isLookingFor!: boolean;
  GENERAL_SEARCH = GENERAL_SEARCH_KEY;

  private reloadDataSrvc = inject(ReloadDataService);

  private isReload: WritableSignal<boolean>;

  constructor() {
    this.isReload = this.reloadDataSrvc.getIsReload();

    this.isLookingFor = false;
    addIcons({ optionsSharp, searchSharp })

    effect(() => {

      if (this.isReload()) {
        this.hideSearchBar(false);
      }

    });
  }

  showSeaarchBar() {
    this.isLookingFor = true;
  }

  hideSearchBar(res: boolean) {
    this.isLookingFor = res;
    this.emmitCancelEvent.emit(false);
  }

}
