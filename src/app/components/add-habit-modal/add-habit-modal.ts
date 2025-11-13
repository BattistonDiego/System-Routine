import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CreateHabito } from '../../interface/habito.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-habit-modal',
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-habit-modal.html',
  styleUrl: './add-habit-modal.scss',
})
export class AddHabitModal implements OnInit {
  selectedIcon: string | null = null;
  selectedColor: string | null = null;

  icons = [
    { name: 'water_drop', label: 'Água', src: 'assets/png/icon-water.png' },
    { name: 'menu_book', label: 'Livro', src: 'assets/png/menu-book.svg' },
    { name: 'fitness_center', label: 'Exercício', src: 'assets/png/fitness-center.svg' },
    { name: 'favorite', label: 'Coração', src: 'assets/png/favorite.svg' },
    { name: 'coffee', label: 'Café', src: 'assets/png/coffee.svg' },
    { name: 'psychology', label: 'Cérebro', src: 'assets/png/psychology.svg' },
    { name: 'apple', label: 'Maçã', src: 'assets/png/apple.svg' },
  ];

  colors = ['#4A90E2', '#F7D154', '#F55E5E', '#53D86A', '#B55EFF', '#FF5AAA'];

  habitoForm!: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddHabitModal>) {}

  ngOnInit() {
    this.habitoForm = this.fb.group({
      nome: ['', Validators.required],
      meta: [0, [Validators.required, Validators.min(1)]],
      unidade: ['', Validators.required],
    });
  }

  close() {
    this.dialogRef.close();
  }

  addHabit() {
    this.dialogRef.close({
      icon: this.selectedIcon,
      color: this.selectedColor,
      habit: this.habitoForm.value,
    });
  }
}
