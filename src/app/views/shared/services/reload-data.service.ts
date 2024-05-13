import { Injectable, WritableSignal, signal } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class ReloadDataService {

    private isReload: WritableSignal<boolean>;

    constructor() {
        this.isReload = signal<boolean>(false);
    }

    getIsReload(): WritableSignal<boolean> {
        return this.isReload;
    }

    setIsReload(isReload: boolean) {
        this.isReload.set(isReload);
    }

}
