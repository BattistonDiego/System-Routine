import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Card } from '../../components/card/card';
import { CardHorizont } from '../../components/card-horizont/card-horizont';
import { History } from '../../components/modals/history-modal/history';
import { MatDialog } from '@angular/material/dialog';
import { HabitModal } from '../../components/modals/habit-modal/habit-modal';
import { HabitoService } from '../../service/habito.service';
import { Habito } from '../../interface/habito.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomSnackbar } from '../../components/custom-snackbar/custom-snackbar';
import { DeleteHabitoModal } from '../../components/modals/delete-habito-modal/delete-habito-modal';
import { HistoricoService } from '../../service/historico.service';
import { UsuarioService } from '../../service/usuario.service';
import { User } from '../../interface/user.model';
import { UserStateService } from '../../service/user-state.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-habts-page',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    CommonModule,
    Card,
    CardHorizont,
    History,
    MatSnackBarModule,
  ],
  templateUrl: './habts-page.html',
  styleUrl: './habts-page.scss',
})
export class HabtsPage implements OnInit {
  selectedDate = new Date();
  completedHabitsCount = 0;
  progress = 0;
  restante = 100;
  habitoCompletado: boolean = false;
  usuarioId!: number | null;
  usuario!: User;
  streak: number = 0;

  constructor(
    private dialog: MatDialog,
    private habitoService: HabitoService,
    private historicoService: HistoricoService,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
    private userStateService: UserStateService,
  ) {}

  listCards: any[] = [];
  totalHabitos: number = 0;
  listHabitos: Habito[] = [];
  listHistorico: any[] = [];

  ngOnInit() {
    this.carregarDadosIniciais();
  }

  carregarDadosIniciais() {
    this.usuarioService
      .getUserLogged()
      .pipe(
        switchMap((res) => {
          this.usuario = res;
          this.usuarioId = res.id;
          localStorage.setItem('perfil', res.perfil);
          localStorage.setItem('usuario', JSON.stringify(res));
          this.userStateService.setUsuario(res);
          return this.habitoService.getHabitos();
        }),
        switchMap((habitos) => {
          this.listHabitos = habitos.map((h) => ({
            ...h,
            current: 0,
          }));

          this.totalHabitos = habitos.length;

          this.updatesCards();
          const hoje = new Date().toISOString().split('T')[0];
          return this.historicoService.getListHistoricoByDate(hoje);
        }),
      )
      .subscribe((historico) => {
        this.listHistorico = historico;

        const habitosComRegistro = this.listHabitos.filter((h) =>
          this.listHistorico.some((r) => r.habito.id === h.id),
        );

        if (habitosComRegistro.length > 0) {
          this.getHabitosCompletadoHoje();
        }

        this.recalculateProgress();

        if (this.listHabitos.length > 0) {
          this.getConsecutivesDay(this.listHabitos[0].id);
        }
      });
  }

  recarregarDados() {
    this.habitoService
      .getHabitos()
      .pipe(
        switchMap((habitos) => {
          this.listHabitos = habitos.map((h) => ({
            ...h,
            current: 0,
          }));

          this.totalHabitos = habitos.length;
          this.updatesCards();
          const hoje = new Date().toISOString().split('T')[0];
          return this.historicoService.getListHistoricoByDate(hoje);
        }),
      )
      .subscribe((res) => {
        this.listHistorico = res;

        const habitosComRegistro = this.listHabitos.filter((h) =>
          this.listHistorico.some((r) => r.habito.id === h.id),
        );

        if (habitosComRegistro.length > 0) {
          this.getHabitosCompletadoHoje();
        }

        this.recalculateProgress();

        if (this.listHabitos.length > 0) {
          this.getConsecutivesDay(this.listHabitos[0].id);
        }
      });
  }

  updatesCards() {
    this.listCards = [
      {
        description: 'Progresso',
        complement: this.progress + '%',
        icon: 'assets/png/icon-progress.png',
      },
      {
        description: 'Hábitos Completos',
        complement: '0/' + this.totalHabitos,
        icon: 'assets/png/icon-complete.png',
      },
      {
        description: 'Sequência',
        complement: this.streak + ' Dias',
        icon: 'assets/png/icon-sequence.png',
      },
    ];
  }

  addHabit(habit: Habito) {
    this.habitoService.postHabitos(habit).subscribe({
      next: () => {
        this.snackBar.openFromComponent(CustomSnackbar, {
          data: {
            message: 'Hábito adicionado com sucesso!',
            icon: 'check_circle',
          },
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });

        this.recarregarDados();
      },
      error: () => {
        this.snackBar.openFromComponent(CustomSnackbar, {
          data: {
            message: 'Error Interno!',
            icon: 'check_circle',
          },
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  deleteHabit(event: { id: number }, habito: Habito) {
    const dialogRef = this.dialog.open(DeleteHabitoModal, {
      data: { nomeHabito: habito.nome },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.habitoService.deleteHabitos(event.id).subscribe({
          next: () => {
            this.snackBar.openFromComponent(CustomSnackbar, {
              data: {
                message: 'Hábito deletado com sucesso!',
                icon: 'check_circle',
              },
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-error'],
            });
            this.recarregarDados();
          },
        });
      }
    });
  }

  updateHabit(id: number) {
    const habitoSelected = this.listHabitos.filter((h) => h.id === id);
    const dialogRef = this.dialog.open(HabitModal, {
      data: {
        habitSelected: habitoSelected[0],
        mode: 'edit',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const body = {
          nome: result.habit.nome,
          meta: result.habit.meta,
          unidade: result.habit.unidade,
          icone: result.icon,
          cor: result.color,
        };
        this.habitoService.editHabitos(habitoSelected[0].id, body).subscribe({
          next: (res) => {
            const index = this.listHabitos.findIndex((h) => h.id === res.id);
            if (index !== -1) {
              this.listHabitos[index] = res;
            }
            this.snackBar.openFromComponent(CustomSnackbar, {
              data: {
                message: 'Hábito alterado com sucesso!',
                icon: 'check_circle',
              },
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-success'],
            });
            // this.loadHabitos();
          },
        });
      }
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

  getHabitosCompletadoHoje() {
    const listHabito = this.listHabitos;
    const listHistorico = this.listHistorico;
    const newList = listHabito.map((h) => {
      const registro = listHistorico.find((r) => r.habito.id === h.id);

      return {
        ...h,
        concluidoHoje: registro?.status ?? false,
        valorAtual: registro?.valorAtual ?? 0,
      };
    });

    this.listHabitos = newList;
  }

  onHabitChanged(event: { index: number; current: number }) {
    this.listHabitos[event.index].current = event.current;

    const habito = this.listHabitos[event.index];

    if (habito.current === habito.meta) {
      this.habitCompleted(habito);
    }
  }

  habitCompleted(habito: Habito) {
    const body = {
      habitoId: habito?.id,
      status: true,
      valorAtual: habito?.current,
    };
    if (habito) {
      this.historicoService.postHistorico(body).subscribe({
        next: (res) => {
          this.habitoCompletado = true;

          const index = this.listHabitos.findIndex((h) => h.id === habito.id);
          if (index !== -1) {
            this.listHabitos[index].concluidoHoje = true;
          }

          this.recalculateProgress();
          this.getConsecutivesDay(this.listHabitos[0].id);
        },
        error: (erro) => {
          this.snackBar.openFromComponent(CustomSnackbar, {
            data: {
              message: 'Hábito ja completado na data de hoje!',
              icon: 'error_outline',
            },
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-error'],
          });
        },
      });
    }
  }

  recalculateProgress() {
    const completed = this.listHabitos.filter((h) => h.concluidoHoje === true).length;

    this.completedHabitsCount = completed;

    const progress = completed === 0 ? 0 : Math.round((completed / this.listHabitos.length) * 100);

    const progressCard = this.listCards.find((c) => c.description === 'Progresso');
    if (progressCard) progressCard.complement = `${progress}%`;

    const habitsCard = this.listCards.find((c) => c.description === 'Hábitos Completos');
    if (habitsCard) habitsCard.complement = `${completed}/${this.listHabitos.length}`;

    this.restante = 100 - progress;
  }

  openAddHabitModal() {
    const dialogRef = this.dialog.open(HabitModal, {
      data: {
        // You can pass data to the modal here if needed
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newHabit: any = {
          usuarioId: this.usuarioId,
          nome: result.habit.nome,
          meta: result.habit.meta,
          unidade: result.habit.unidade,
          icone: result.icon,
          cor: result.color,
        };
        this.addHabit(newHabit);
      }
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
    const streakCard = this.listCards.find((c) => c.description === 'Sequência');

    if (streakCard) {
      streakCard.complement = this.streak + ' Dias';
    }
  }

  openHistoryModal() {
    const dialogRef = this.dialog.open(History, {
      data: {
        // You can pass data to the modal here if needed
      },
    });
  }
}
