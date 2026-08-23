import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabtsPage } from './habts-page';
import { Habito } from '../../interface/habito.model';
import { HabitoService } from '../../service/habito.service';
import { of } from 'rxjs';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { UsuarioService } from '../../service/usuario.service';
import { HistoricoService } from '../../service/historico.service';

describe('HabtsPage', () => {
  let component: HabtsPage;
  let fixture: ComponentFixture<HabtsPage>;

  let habitService: jasmine.SpyObj<HabitoService>;
  let usuarioService: jasmine.SpyObj<UsuarioService>;
  let historicoService: jasmine.SpyObj<HistoricoService>;

  beforeEach(async () => {
    habitService = jasmine.createSpyObj('HabitoService', ['getHabitos']);
    usuarioService = jasmine.createSpyObj('UsuarioService', ['getUserLogged']);
    historicoService = jasmine.createSpyObj('HistoricoService', ['getListHistoricoByDate']);

    await TestBed.configureTestingModule({
      imports: [HabtsPage],
      providers: [
        provideRouter([]),
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        { provide: HabitoService, useValue: habitService },
        { provide: UsuarioService, useValue: usuarioService },
        { provide: HistoricoService, useValue: historicoService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HabtsPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve retornar lista de habitos', () => {
    // Arrange
    const habitos: Habito[] = [
      {
        id: 1,
        usuario: {
          id: 1,
          nome: 'Diego Battiston',
          email: 'diego@email.com',
          telefone: '11999999999',
          senha: '123456',
          perfil: 'ADMIN',
          status: 'ATIVO',
        },
        nome: 'Beber água',
        meta: 2000,
        unidade: 'ml',
        icone: 'water_drop',
        cor: '#2196F3',
        current: 1200,
        concluidoHoje: false,
        valorAtual: 1200,
      },
    ];
    const usuario = { id: 1, nome: 'Diego', perfil: 'ADMINISTRADOR' };
    usuarioService.getUserLogged.and.returnValue(of(usuario));
    habitService.getHabitos.and.returnValue(of(habitos));
    historicoService.getListHistoricoByDate.and.returnValue(of([]));

    // Act
    fixture.detectChanges(); // dispara o ngOnInit

    // Assert
    expect(component.listHabitos.length).toBe(1);
  });

  it('deve retornar lista vazia', () => {
    // Arrange
    const usuario = { id: 1, nome: 'Diego', perfil: 'ADMINISTRADOR' };
    usuarioService.getUserLogged.and.returnValue(of(usuario));
    habitService.getHabitos.and.returnValue(of([]));
    historicoService.getListHistoricoByDate.and.returnValue(of([]));

    // Act
    fixture.detectChanges(); // dispara o ngOnInit

    // Assert
    expect(component.listHabitos).toEqual([]);
  });
});
