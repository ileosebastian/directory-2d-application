import { Component, OnInit, inject } from '@angular/core';
import { NgFor } from '@angular/common';

import { IonItem, IonLabel, IonRadio, IonRadioGroup } from '@ionic/angular/standalone';

import { ModalButtonsComponent } from '../modal-buttons/modal-buttons.component';

import { DialogService } from '../../services/dialog.service';
import { UniversityController } from '../../../../core/university/infraestructure/university.cotroller';

import { ModalButton } from '../../../shared/models/app.interfaces';
import { Campus } from '../../../../core/university/domain/campus.domain';


@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss'],
  standalone: true,
  imports: [
    IonRadioGroup,
    IonItem,
    IonRadio,
    IonLabel,
    NgFor,
    ModalButtonsComponent,
  ],
})
export class SelectionComponent implements OnInit {

  selectionButtons: ModalButton[] = [
    {
      role: 'goto',
      text: 'volver',
      color: 'secondary',
      disable: false,
      goto: 'welcome'
    },
    {
      role: 'goto',
      text: 'continuar',
      color: 'primary',
      disable: true,
      goto: 'installation'
    }
  ];

  campuses: Campus[] = [];
  campSelected: Campus | null = null;

  private universityCtrl = inject(UniversityController);
  private dialogSrvc = inject(DialogService);

  constructor() { }

  async ngOnInit() {
    this.campuses = await this.universityCtrl.getCampusList();
  }

  selectCampus(campus: Campus) {

    this.campSelected = campus;

    if (this.campSelected) {
      this.selectionButtons[1].disable = false;
      this.dialogSrvc.setMessage(this.campSelected);
    }

  }

}
