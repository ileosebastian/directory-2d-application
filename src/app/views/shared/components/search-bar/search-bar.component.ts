import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild, WritableSignal, effect, inject } from '@angular/core';

import { IonButton, IonIcon, IonSearchbar } from '@ionic/angular/standalone';
import { search } from 'ionicons/icons';
import { addIcons } from 'ionicons';

import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';

import { GENERAL_SEARCH_KEY } from '../../../../core/shared/data/constants.data';
import { SearchingType } from '../../../../core/shared/models/core.types';
import { ReloadDataService } from '../../services/reload-data.service';


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
  imports: [
    IonSearchbar,
    IonButton,
    IonIcon
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBarComponent implements OnInit {

  @ViewChild('searchbar', { static: true }) searchbar!: IonSearchbar;

  @Input() category!: SearchingType | string;
  @Input() colorCategory: string = 'secondary';
  @Input() showCancelBtn: boolean = false;

  @Output() emmitSearchText = new EventEmitter<string>();
  @Output() isLookingFor = new EventEmitter<boolean>();
  @Output() emittIfNoText = new EventEmitter();

  private reloadDataSrvc = inject(ReloadDataService);

  private isNative: boolean;
  private text: string = '';
  private isReload: WritableSignal<boolean>;

  constructor() {
    this.isNative = Capacitor.getPlatform() !== 'web';
    addIcons({ search });
    this.isReload = this.reloadDataSrvc.getIsReload();

    effect(async () => {

      if (this.isReload()) {
        this.text = '';
        this.emittIfNoText.emit();
        this.isLookingFor.emit(false);
        if (this.searchbar) {
          this.searchbar.value = '';
        }
      }

    });
  }

  async ngOnInit() {
    if (this.category != GENERAL_SEARCH_KEY) {
      if (this.isNative) await Keyboard.show();
      await this.searchbar.setFocus();
    }
  }

  listenNewText(ev: any) {
    this.text = ev.target.value.toLowerCase();
    if (ev.target.value.replace(/\s/g, "").length === 0) {
      this.emittIfNoText.emit();
    }
  }

  search() {
    this.emmitSearchText.emit(this.text);
  }

  async cancelSearch() {
    this.isLookingFor.emit(false);
    if (this.isNative) await Keyboard.hide();
  }

}
