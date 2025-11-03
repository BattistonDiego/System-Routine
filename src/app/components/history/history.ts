import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class History {
  listHistory = [
    {
      date: '02 de Novembro',
      completed: '3/3 hábitos completos',
      percentage: '100%',
    },
    {
      date: '01 de Novembro',
      completed: '3/3 hábitos completos',
      percentage: '100%',
    },
    {
      date: '31 de Outubro',
      completed: '3/3 hábitos completos',
      percentage: '100%',
    },
  ];
}
