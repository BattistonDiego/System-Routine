import { Component, OnInit } from '@angular/core';
import { Habito } from '../../interface/habito.model';
import { RouterLink } from '@angular/router';
import { Card } from '../../components/card/card';
import { CommonModule } from '@angular/common';
import { HistoricoService } from '../../service/historico.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';
import { User } from '../../interface/user.model';
import { HabitoService } from '../../service/habito.service';
import { LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { Zap, Target, Award } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, Card, CommonModule, BaseChartDirective, LucideAngularModule],
  providers: [
    {
      provide: LUCIDE_ICONS,
      useValue: new LucideIconProvider({ Zap, Target, Award }),
      multi: true,
    },
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {
  usuario!: User;

  progress = 0;
  quantidadeHabitos = 0;
  habitoscount = 0;
  bestSequencia: number = 0;
  qntdEsteMes: number = 0;
  mediaHabitosCompletados: number = 0;
  streak: number = 0;
  atividades: any[] = [];

  dias: { data: string; qntd: number }[] = [];
  semanas: { data: string; qntd: number }[][] = [];

  totalHabitos: number = 0;
  listHabitos: Habito[] = [];
  listHistorico: any[] = [];

  listCards = [
    {
      description: 'Progresso',
      complement: 0 + '%',
      icon: 'assets/png/icon-progress.png',
    },
    {
      description: 'Hábitos Completos',
      complement: '0/' + 0,
      icon: 'assets/png/icon-complete.png',
    },
    {
      description: 'Sequência Atual',
      complement: 0 + ' Dias',
      icon: 'assets/png/icon-sequence.png',
    },
    {
      description: 'Total de Hábitos',
      complement: 0 + '',
      icon: 'assets/png/icon-hab.png',
    },
  ];

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Hábitos concluídos', backgroundColor: '#3b82f6' }],
  };

  barChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        ticks: {
          color: '#9ca3af',
          stepSize: 1,
          precision: 0,
        },
        grid: { color: '#2d3348' },
      },
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: '#2d3348' },
      },
    },
  };

  doughnutData: ChartData<'doughnut'> = {
    datasets: [
      {
        data: [50, 50], // [progresso, restante]
        backgroundColor: ['#3b82f6', '#2d3348'],
        borderWidth: 0,
      },
    ],
  };

  doughnutOptions = {
    cutout: '80%',
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  constructor(
    private historicoService: HistoricoService,
    private habitoService: HabitoService,
  ) {}

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario')!);
    this.loadResumoSemanal(this.usuario.id);
    this.loadHabitos();
    this.loadQntdHabEsteMes();
    this.loadMediaHabitosCompletados();
    this.loadAtividades();
  }

  loadResumoSemanal(userId: number) {
    this.historicoService.getResumoSemanal(userId).subscribe((res) => {
      const dias = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const mapaQuantidade = new Map(res.map((r) => [r.dia.trim(), r.quantidade]));

      this.barChartData = {
        labels: dias,
        datasets: [
          {
            data: dias.map((d) => mapaQuantidade.get(d) ?? 0),
            label: 'Hábitos concluídos',
            backgroundColor: '#3b82f6',
          },
        ],
      };
    });
  }

  loadHabitos() {
    this.habitoService.getHabitos().subscribe((habitos) => {
      this.listHabitos = habitos.map((h) => ({
        ...h,
        current: 0,
      }));
      this.quantidadeHabitos = habitos.length;
      this.loadMelhorSequencia();

      this.loadHabitosCompletadosHoje();

      const habitoId = habitos[0].id;
      this.getConsecutivesDay(habitoId);

      this.totalHabitos = habitos.length;
    });
  }

  loadHabitosCompletadosHoje() {
    const hoje = new Date().toISOString().split('T')[0];

    this.historicoService.getListHistoricoByDate(hoje).subscribe((res) => {
      const completed = res.length;
      this.habitoscount = completed;

      if (res.length > 0) {
        this.progress =
          completed === 0 ? 0 : Math.round((completed / this.listHabitos.length) * 100);

        const restante = 100 - this.progress;

        this.doughnutData = {
          datasets: [
            {
              data: [this.progress, restante],
              backgroundColor: ['#3b82f6', '#2d3348'],
              borderWidth: 0,
            },
          ],
        };
      }
      this.updateCards();
    });
  }

  updateCards() {
    this.listCards = [
      {
        description: 'Total de Hábitos',
        complement: this.quantidadeHabitos.toString(),
        icon: 'assets/png/icon-hab.png',
      },
      {
        description: 'Progresso',
        complement: this.progress + '%',
        icon: 'assets/png/icon-progress.png',
      },
      {
        description: 'Hábitos Completos',
        complement: this.habitoscount + '/' + this.quantidadeHabitos,
        icon: 'assets/png/icon-complete.png',
      },
      {
        description: 'Sequência Atual',
        complement: this.streak + ' Dias',
        icon: 'assets/png/icon-sequence.png',
      },
    ];
  }

  loadMelhorSequencia() {
    const firstHabitoId = this.listHabitos[0].id;
    this.historicoService.getMelhorSequencia(this.usuario.id, firstHabitoId).subscribe({
      next: (res) => (this.bestSequencia = res),
    });
  }

  loadQntdHabEsteMes() {
    this.historicoService.getqntdHabitosEsteMes(this.usuario.id).subscribe({
      next: (res) => (this.qntdEsteMes = res),
    });
  }

  loadAtividades() {
    this.historicoService.getAtividades().subscribe({
      next: (res) => {
        this.atividades = res;
        this.dias = this.gerarDias();
        this.semanas = this.gerarSemanas();
      },
    });
  }

  gerarDias(): { data: string; qntd: number }[] {
    const dias = [];
    const hoje = new Date();
    const inicio = new Date();
    inicio.setMonth(hoje.getMonth() - 6);

    const current = new Date(inicio);

    while (current <= hoje) {
      const dataFormatada = current.toISOString().split('T')[0];

      const encontrado = this.atividades.find((a) => a.data === dataFormatada);

      dias.push({
        data: dataFormatada,
        qntd: encontrado ? encontrado.qntdHabitos : 0,
      });

      current.setDate(current.getDate() + 1);
    }

    return dias;
  }

  gerarSemanas(): { data: string; qntd: number }[][] {
    const dias = this.dias;
    const semanas: { data: string; qntd: number }[][] = [];

    const primeiroDia = new Date(dias[0].data);
    const diaDaSemana = primeiroDia.getDay();

    let semanaAtual: { data: string; qntd: number }[] = [];
    for (let i = 0; i < diaDaSemana; i++) {
      semanaAtual.push({ data: '', qntd: -1 });
    }

    for (const dia of dias) {
      semanaAtual.push(dia);
      if (semanaAtual.length === 7) {
        semanas.push(semanaAtual);
        semanaAtual = [];
      }
    }

    if (semanaAtual.length > 0) {
      while (semanaAtual.length < 7) {
        semanaAtual.push({ data: '', qntd: -1 });
      }
      semanas.push(semanaAtual);
    }

    return semanas;
  }

  getColor(qntd: number): string {
    if (qntd === 0) return '#1e2333';
    if (qntd === 1) return '#1e3a5f';
    if (qntd === 2) return '#1d5fa6';
    if (qntd === 3) return '#2563eb';
    return '#3b82f6'; // 4+
  }

  loadMediaHabitosCompletados() {
    this.historicoService.getMediaHabitoCompletado(this.usuario.id).subscribe({
      next: (res) => (this.mediaHabitosCompletados = res),
    });
  }

  getConsecutivesDay(habitoId: number) {
    this.historicoService.getStreak(habitoId).subscribe({
      next: (res) => {
        this.streak = res;
        this.updateCardsAfterStreak();
      },
    });
  }

  updateCardsAfterStreak() {
    const streakCard = this.listCards.find((c) => c.description === 'Sequência Atual');

    if (streakCard) {
      streakCard.complement = this.streak + ' Dias';
    }
  }

  getDataFormatada(): string {
    const hoje = new Date();
    return hoje.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }

  formatarData(data: string): string {
    if (!data) return '';
    const date = new Date(data + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
