import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Card } from '../../components/card/card';
import { CardHorizont } from '../../components/card-horizont/card-horizont';

@Component({
  selector: 'app-habts-page',
  imports: [MatIconModule, MatButtonModule, CommonModule, Card, CardHorizont],
  templateUrl: './habts-page.html',
  styleUrl: './habts-page.scss',
})
export class HabtsPage {
  selectedDate = new Date();

  listCards = [
    { description: 'Progresso', complement: '70%', icon: 'assets/png/icon-progress.png' },
    {
      description: 'Hábitos Completos',
      complement: '0/3',
      icon: 'assets/png/icon-complete.png',
    },
    { description: 'Sequência', complement: '3 Dias', icon: 'assets/png/icon-sequence.png' },
  ];

  listCardsHorizontal = [
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
}
