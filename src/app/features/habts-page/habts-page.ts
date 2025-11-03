import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Card } from '../../components/card/card';
import { CardHorizont } from '../../components/card-horizont/card-horizont';
import { History } from '../../components/history/history';
import { MatDialog } from '@angular/material/dialog';
import { AddHabitModal } from '../../components/add-habit-modal/add-habit-modal';

@Component({
  selector: 'app-habts-page',
  imports: [MatIconModule, MatButtonModule, CommonModule, Card, CardHorizont, History],
  templateUrl: './habts-page.html',
  styleUrl: './habts-page.scss',
})
export class HabtsPage {
  selectedDate = new Date();
  completedHabitsCount = 0;
  progress = 0;
  restante = 100;
  showHistoryFlag = false;

  constructor(private dialog: MatDialog) {}

  listCards = [
    {
      description: 'Progresso',
      complement: this.progress + '%',
      icon: 'assets/png/icon-progress.png',
    },
    {
      description: 'Hábitos Completos',
      complement: '0/3',
      icon: 'assets/png/icon-complete.png',
    },
    { description: 'Sequência', complement: '3 Dias', icon: 'assets/png/icon-sequence.png' },
  ];

  listTotalHabitos = [
    {
      name: 'Beber água',
      goal: 3,
      current: 0,
      icon: 'assets/png/icon-water.png',
      description: 'Litros',
    },
    {
      name: 'Estudar',
      goal: 30,
      current: 0,
      icon: 'assets/png/icon-study.png',
      description: 'Minutos',
    },
    {
      name: 'Exercícios',
      goal: 1,
      current: 0,
      icon: 'assets/png/icon-workout.png',
      description: 'Sessão',
    },
  ];

  changeDate(days: number) {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(this.selectedDate.getDate() + days);
    this.selectedDate = newDate;
  }

  goToToday() {
    this.selectedDate = new Date();
  }

  showHistory() {
    this.showHistoryFlag = !this.showHistoryFlag;
  }

  onHabitChanged(event: { index: number; current: number }) {
    this.listTotalHabitos[event.index].current = event.current;
    this.recalculateProgress();
  }

  recalculateProgress() {
    const completed = this.listTotalHabitos.filter((h) => h.current >= h.goal).length;
    this.completedHabitsCount = completed;

    const progress = Math.round((completed / this.listTotalHabitos.length) * 100);

    const progressCard = this.listCards.find((c) => c.description === 'Progresso');
    if (progressCard) progressCard.complement = `${progress}%`;

    const habitsCard = this.listCards.find((c) => c.description === 'Hábitos Completos');
    if (habitsCard) habitsCard.complement = `${completed}/${this.listTotalHabitos.length}`;

    this.restante = 100 - progress;
  }

  openAddHabitModal() {
    this.dialog.open(AddHabitModal, {
      data: {
        // You can pass data to the modal here if needed
      },
    });
  }
}
