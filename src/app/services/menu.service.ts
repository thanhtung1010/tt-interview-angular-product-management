import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MenuSerice {
  visible$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  constructor() {}

  get visible(): boolean {
    return this.visible$.value;
  }

  onTogglVisileMenu(): boolean {
    const curVal = this.visible$.value;
    this.visible$.next(!curVal);
    return !curVal;
  }
}
