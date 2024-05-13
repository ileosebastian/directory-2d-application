import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, inject } from '@angular/core';

import { IonInfiniteScroll as InfiniteScroll } from '@ionic/angular';
import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';

import { PlaceController } from '../../../../core/place/infraestructure/place.controller';
import { ProfessorController } from '../../../../core/professor/infraestructure/professor.controller';

import { Place } from '../../../../core/place/domain/place.domain';
import { Professor } from '../../../../core/professor/domain/professor.domain';
import { ALL_FACULTIES_KEY, PLACE_SEARCH_KEY } from 'src/app/core/shared/data/constants.data';
import { ScopeFilter } from 'src/app/core/shared/models/core.types';
import { NetworkService } from 'src/app/views/shared/services/network/network.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-inifinite-scroll-item-list',
  templateUrl: './inifinite-scroll-item-list.component.html',
  styleUrls: ['./inifinite-scroll-item-list.component.scss'],
  standalone: true,
  imports: [
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    NgIf
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InifiniteScrollItemListComponent implements OnInit, OnDestroy {

  @Input() typeItem!: ScopeFilter;

  @Input() items!: Professor[] | Place[];
  @Input() isCampus!: boolean;
  @Input() isSearching!: boolean;

  @Input() campus!: string;
  @Input() faculty!: string;

  @Input() category: string = PLACE_SEARCH_KEY;

  @Input() text: string = 'Cargando ...';

  @Output() emittNewProfessors = new EventEmitter<Professor[]>;
  @Output() emittNewPlaces = new EventEmitter<Place[]>;

  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: InfiniteScroll;

  private isOnlineMode: boolean;

  private networkSrvc = inject(NetworkService);

  private profeCtrl = inject(ProfessorController);
  private placeCtrl = inject(PlaceController);

  private suscriptorOnlineMode: Subscription;

  constructor() {
    this.isOnlineMode = this.networkSrvc.isOnline.value;

    this.suscriptorOnlineMode = this.networkSrvc.isOnline
      .subscribe(isOnline => {
        this.isOnlineMode = isOnline;
      });
  }

  ngOnInit() { }

  ngOnDestroy(): void {
    this.suscriptorOnlineMode.unsubscribe();
  }

  async loadingData() {
    let possibleNewItems: Professor[] | Place[] = [];

    if (this.items.length > 0) {
      if (this.isCampus) {
        possibleNewItems = this.typeItem === 'professor' ?
          await this.profeCtrl.searchAllProfessors(this.isOnlineMode, ALL_FACULTIES_KEY, this.campus, true) :
          await this.placeCtrl.searchAllPlaces(this.isOnlineMode, ALL_FACULTIES_KEY, this.campus, this.category, true);
      } else {
        possibleNewItems = this.typeItem === 'professor' ?
          await this.profeCtrl.searchAllProfessors(this.isOnlineMode, '', this.faculty, true) :
          await this.placeCtrl.searchAllPlaces(this.isOnlineMode, '', this.faculty, this.category, true);
      }

      if (possibleNewItems.length === this.items.length) {
        this.infiniteScroll.complete();
        return;
      }
    }

    setTimeout(() => {
      this.items = this.isSearching ? this.items : possibleNewItems;
      if (this.typeItem === 'professor')
        this.emittNewProfessors.emit(this.items as Professor[]);
      else
        this.emittNewPlaces.emit(this.items as Place[]);
      this.infiniteScroll.complete();
    }, 0);
  }

}
