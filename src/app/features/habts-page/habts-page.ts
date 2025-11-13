import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Card } from '../../components/card/card';
import { CardHorizont } from '../../components/card-horizont/card-horizont';
import { History } from '../../components/history/history';
import { MatDialog } from '@angular/material/dialog';
import { AddHabitModal } from '../../components/add-habit-modal/add-habit-modal';
import { HabitoService } from '../../service/habito.service';
import { CreateHabito, Habito } from '../../interface/habito.model';

@Component({
  selector: 'app-habts-page',
  imports: [MatIconModule, MatButtonModule, CommonModule, Card, CardHorizont, History],
  templateUrl: './habts-page.html',
  styleUrl: './habts-page.scss',
})
export class HabtsPage implements OnInit {
  selectedDate = new Date();
  completedHabitsCount = 0;
  progress = 0;
  restante = 100;
  showHistoryFlag = false;

  constructor(private dialog: MatDialog, private habitoService: HabitoService) {}

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

  listHabitos: Habito[] = [];

  ngOnInit() {
    this.loadHabitos();
  }

  loadHabitos() {
    this.habitoService.getHabitos().subscribe((habitos) => {
      this.listHabitos = habitos.map((h) => ({
        ...h,
        current: 0,
      }));

      console.log(this.listHabitos);
    });
  }

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
    console.log(event.index, event.current);
    this.listHabitos[event.index].current = event.current;
    this.recalculateProgress();
  }

  recalculateProgress() {
    const completed = this.listHabitos.filter((h) => h.current! >= h.meta).length;
    this.completedHabitsCount = completed;

    const progress = Math.round((completed / this.listHabitos.length) * 100);

    const progressCard = this.listCards.find((c) => c.description === 'Progresso');
    if (progressCard) progressCard.complement = `${progress}%`;

    const habitsCard = this.listCards.find((c) => c.description === 'Hábitos Completos');
    if (habitsCard) habitsCard.complement = `${completed}/${this.listHabitos.length}`;

    this.restante = 100 - progress;
  }

  openAddHabitModal() {
    const dialogRef = this.dialog.open(AddHabitModal, {
      data: {
        // You can pass data to the modal here if needed
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newHabit: Habito = {
          nome: result.habit.nome,
          meta: result.habit.meta,
          unidade: result.habit.unidade,
          icone: result.icon,
          cor: result.color,
        };
        this.addHabit(newHabit);
        console.log(newHabit);
      }
    });
  }

  addHabit(habit: Habito) {
    this.habitoService.postHabitos(habit).subscribe({
      next: (response) => {
        console.log('Habit added successfully:', response);
      },
    });
  }
}
