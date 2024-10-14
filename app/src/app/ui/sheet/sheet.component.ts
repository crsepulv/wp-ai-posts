import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent],
  providers: [
    provideIcons({
      lucideX,
    }),
  ],
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.scss',
})
export class SheetComponent {
  @Input() isOpen = false;
  @Output() toggleEvent: EventEmitter<boolean> = new EventEmitter();

  handleToggle() {
    this.toggleEvent.emit(!this.isOpen);
  }
}
