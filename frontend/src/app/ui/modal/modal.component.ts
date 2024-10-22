import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],

  templateUrl: './modal.component.html',
})
export class ModalComponent {
  @Input() isOpen = false;
  @Output() toggleEvent: EventEmitter<boolean> = new EventEmitter();

  handleToggle() {
    this.toggleEvent.emit(!this.isOpen);
  }
}
