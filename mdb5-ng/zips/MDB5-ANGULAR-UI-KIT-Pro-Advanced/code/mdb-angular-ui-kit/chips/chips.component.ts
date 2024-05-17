import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MdbChipComponent } from './chip.component';
import { MdbChipsInputDirective } from './chips-input.directive';

@Component({
  selector: 'mdb-chips',
  templateUrl: './chips.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbChipsComponent implements AfterContentInit, OnDestroy {
  @ContentChild(MdbChipsInputDirective) chipsInput: MdbChipsInputDirective;
  @ContentChild(MdbChipsInputDirective, { read: ElementRef, static: true }) inputEl: ElementRef;
  @ContentChildren(MdbChipComponent, { descendants: true }) chips: QueryList<MdbChipComponent>;

  private _destroy$ = new Subject<void>();

  @HostBinding('class.chips') chipsClass = true;

  @HostBinding('class.chips-initial') chipsInitial = true;

  @HostListener('click', ['$event'])
  onFocus(event: any) {
    const classList = event.target.classList;

    if (
      classList.contains('chip') ||
      classList.contains('close') ||
      classList.contains('text-chip')
    ) {
      return;
    }

    this.inputEl.nativeElement.focus();
  }

  constructor() {}

  ngAfterContentInit(): void {
    if (this.chips.length) {
      this.chipsInput._hasItems = true;
      this.chipsInput.stateChanges.next();
    }

    this.chips.changes.pipe(takeUntil(this._destroy$)).subscribe(() => {
      const hasItems = !!this.chips.length;
      this.chipsInput._hasItems = hasItems;
      this.chipsInput.stateChanges.next();
    });

    this.chipsInput.deleteChip.pipe(takeUntil(this._destroy$)).subscribe(() => {
      const lastChip = this.chips.last;

      if (lastChip) {
        lastChip.delete();
      }
    });
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
