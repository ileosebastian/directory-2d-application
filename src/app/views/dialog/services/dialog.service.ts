import { Injectable, WritableSignal, signal } from '@angular/core';

import { DialogState } from '../../../core/shared/models/core.types';
import { Campus } from '../../../core/university/domain/campus.domain';


@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private currentDialog: WritableSignal<DialogState | null> = signal(null);
  private message: Campus | null = null;

  constructor() { }

  getCurrentDialog() {
    return this.currentDialog;
  }

  getMessage() {
    return this.message;
  }

  setMessage(message: Campus | null) {
    this.message = message;
  }

  setCurrentDialog(state: DialogState) {
    this.currentDialog.set(state);
  }

}
