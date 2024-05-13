import { Component, EnvironmentInjector, ViewChildren, inject } from '@angular/core';

import { IonTabBar, IonTabButton, IonTabs, IonIcon, IonLabel,  } from '@ionic/angular/standalone';
import { business, personCircle, search } from 'ionicons/icons';
import { addIcons } from 'ionicons';

import { PROFESSOR_SEARCH_KEY, PLACE_SEARCH_KEY, GENERAL_SEARCH_KEY } from '../../../../core/shared/data/constants.data';


interface EventTab {
  tab: string;
}

@Component({
  selector: 'app-content-directory',
  templateUrl: './content-directory.page.html',
  styleUrls: ['./content-directory.page.scss'],
  standalone: true,
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel
  ],
})
export class ContentDirectoryPage {

  @ViewChildren(IonTabButton) tabs!: IonTabButton[];

  PROFESSOR = PROFESSOR_SEARCH_KEY;
  PLACE = PLACE_SEARCH_KEY;
  GENERAL = GENERAL_SEARCH_KEY;

  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({ business, personCircle, search });
  }

  onWillChanges(ev: EventTab) {
    if (!this.tabs) { // If it is undefined, it is because it is the first time you start the app
      return;
    }

    this.tabs.forEach(tab => {

      if (tab.tab && tab.tab === ev.tab) {
        tab.layout = 'label-hide';
        tab.selected = true;
      } else {
        tab.layout = 'icon-top';
        tab.selected = false;
      }

    });
  }

}
