import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-card-horizont',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatProgressBarModule, CommonModule],
  templateUrl: './card-horizont.html',
  styleUrl: './card-horizont.scss',
})
export class CardHorizont {
  @Input() name: string = '';
  @Input() goal!: number;
  @Input() current!: number;
  @Input() icon!: string;
  @Input() description: string = '';

  @Output() completed = new EventEmitter<any>();
  @Output() incompleted = new EventEmitter<any>();

  increase(): void {
    if (this.current < this.goal) {
      this.current++;
      if (this.current === this.goal) {
        this.completed.emit();
      }
    }
  }

  decrease(): void {
    if (this.current > 0) {
      this.current--;
      if (this.current !== this.goal) {
        this.incompleted.emit();
      }
    }
  }

  get progress(): number {
    return (this.current / this.goal) * 100;
  }
}
