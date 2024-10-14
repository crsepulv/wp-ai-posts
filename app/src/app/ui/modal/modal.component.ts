import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({
    lucideX
  })],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() isOpen = false;
  @Output() toggleEvent: EventEmitter<boolean> = new EventEmitter();

  handleToggle() {
    this.toggleEvent.emit(!this.isOpen);
  }
}
