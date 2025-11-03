import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-habit-modal',
  imports: [CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './add-habit-modal.html',
  styleUrl: './add-habit-modal.scss',
})
export class AddHabitModal {
  selectedIcon: string | null = null;
  selectedColor: string | null = null;

  icons = [
    { name: 'water_drop', label: 'Água' },
    { name: 'menu_book', label: 'Livro' },
    { name: 'fitness_center', label: 'Exercício' },
    { name: 'favorite', label: 'Coração' },
    { name: 'coffee', label: 'Café' },
    { name: 'psychology', label: 'Cérebro' },
    { name: 'apple', label: 'Maçã' },
  ];

  colors = ['#4A90E2', '#F7D154', '#F55E5E', '#53D86A', '#B55EFF', '#FF5AAA'];

  constructor(private dialogRef: MatDialogRef<AddHabitModal>) {}

  close() {
    this.dialogRef.close();
  }

  addHabit() {
    this.dialogRef.close({
      icon: this.selectedIcon,
      color: this.selectedColor,
    });
  }
}
