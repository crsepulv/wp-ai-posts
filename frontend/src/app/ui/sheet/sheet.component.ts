import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sheet.component.html',
})
export class SheetComponent {
  @Input() isOpen = false;
  @Output() toggleEvent: EventEmitter<boolean> = new EventEmitter();

  handleToggle() {
    this.toggleEvent.emit(!this.isOpen);
  }
}
