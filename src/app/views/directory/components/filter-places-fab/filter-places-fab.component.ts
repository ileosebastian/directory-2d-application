import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ActionSheetButton, ActionSheetController } from '@ionic/angular';
import { IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';

import { Observable } from 'rxjs';

import { Category } from '../../../shared/models/search-category.interface';
import { GENERAL_SEARCH_KEY, PLACE_SEARCH_KEY, PROFESSOR_SEARCH_KEY } from '../../../../core/shared/data/constants.data';

import { toUpperCaseFirstChar } from '../../../shared/utils/uppercase-first-char.utils';
import { GetStaticDataService } from '../../../shared/services/http/get-static-data.service';
import { filter, exit } from 'ionicons/icons';
import { addIcons } from 'ionicons';


@Component({
  selector: 'app-filter-places-fab',
  templateUrl: './filter-places-fab.component.html',
  styleUrls: ['./filter-places-fab.component.scss'],
  standalone: true,
  imports: [
    IonFab,
    IonFabButton,
    IonIcon
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterPlacesFabComponent implements OnInit {

  @Input() colorByPlace: string = 'primary';
  @Input() categoryName: string = '';

  buttonsAS!: ActionSheetButton<any>[];
  subcategories!: Observable<Category[]> | undefined;

  private actionSheetCtrl = inject(ActionSheetController);
  private dataService = inject(GetStaticDataService);
  private router = inject(Router);

  constructor() {
    addIcons({ filter, exit });
  }

  ngOnInit() {
    this.buttonsAS = [];
    if (this.categoryName !== PROFESSOR_SEARCH_KEY && this.categoryName !== GENERAL_SEARCH_KEY) {
      this.subcategories = this.dataService.getClearCategoryIcons();
    }
  }

  async showFilterActionSheet(ev: any) {
    this.buttonsAS = this.buttonsAS.length === 0 ?
      await this.buttonsByCategory() :
      this.buttonsAS;

    const actionSheet = await this.actionSheetCtrl.create({
      header: "Filtrar ambientes por",
      buttons: this.buttonsAS,
    });

    await actionSheet.present();
  }

  private async buttonsByCategory(): Promise<ActionSheetButton<any>[]> {
    const buttons: ActionSheetButton<any>[] = [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'cancel-btn',
        icon: 'exit',
        data: {
          action: 'cancel',
        },
      },
    ];

    if (this.categoryName !== PLACE_SEARCH_KEY) {
      buttons.unshift({
        text: toUpperCaseFirstChar('regresar a ambientes'),
        icon: 'business',
        cssClass: 'back-to-places',
        data: {},
        handler: () => {
          this.router.navigate([`/search/${PLACE_SEARCH_KEY}`], { replaceUrl: true });
        }
      });
    }

    await this.subcategories?.forEach(category => {
      category.forEach(cat => {
        buttons.unshift({
          text: toUpperCaseFirstChar(cat.name),
          icon: cat.category,
          data: {
            category: cat.category,
            color: cat.color,
          },
          handler: () => {
            this.router.navigate([`/search/${PLACE_SEARCH_KEY}/${cat.category}`], { replaceUrl: true });
          }
        });
      });
    });

    return buttons;
  }

}
