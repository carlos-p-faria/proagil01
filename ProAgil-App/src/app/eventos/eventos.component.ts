import { EventoService } from './../_services/evento.service';
import { Component, OnInit } from '@angular/core';
import { Evento } from '../_models/Evento';
import { BsModalRef } from 'ngx-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { defineLocale, BsLocaleService, ptBrLocale} from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})

export class EventosComponent implements OnInit {
  titulo = 'Eventos';
  eventosFiltrados: Evento[] = [];
  eventos: Evento[] = [];
  evento: Evento;
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  modalRef: BsModalRef;
  registerForm: FormGroup;
  putOrPost: string;
  bodyDeletarEvento: string;
  file: File;

  _filtroLista = '';

  constructor(
    private eventoService: EventoService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private localeService: BsLocaleService) {
      this.localeService.use('pt-br');
  }

  get filtroLista(): string {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this._filtroLista ? this.filtrarEventos(this._filtroLista) : this.eventos;
  }

  ngOnInit() {
    this.getEventos();
    this.validation();
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  validation() {
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      imagemURL: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  salvarAlteracao(template: any) {
    if (this.registerForm.valid) {
      if (this.putOrPost === 'POST') {
        this.evento = Object.assign({}, this.registerForm.value);

        this.eventoService.postUpload(this.file).subscribe();

        // e.g. c:\\fakeFolder\\nomearquivo.jpg
        const arquivoNome = this.evento.imagemURL.split('\\', 3)[2];
        this.evento.imagemURL = arquivoNome;
        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
            console.log(novoEvento);
            template.hide();
            this.getEventos();
            this.toastr.success('Inserido com sucesso');
          }, error => {
            this.toastr.error(`Erro ao tentar inserir: ${ error }`);
            console.log(error);
          }
          );
      } else {
          this.evento = Object.assign({ id: this.evento.id }, this.registerForm.value);
          this.eventoService.putEvento(this.evento).subscribe(
            () => {
              template.hide();
              this.getEventos();
              this.toastr.success('Alterado com sucesso');
            }, error => {
              this.toastr.error(`Erro ao tentar alterar: ${ error }`);
              console.log(error);
            }
          );
      }
    }
  }

  editEvento(evento: Evento, template: any) {
    this.putOrPost = 'PUT';
    this.openModal(template, evento);
  }

  addEvento(template: any) {
    this.putOrPost = 'POST';
    this.openModal(template);
  }

  excluirEvento(evento: Evento, template: any) {
    this.putOrPost = 'NONE';
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento).subscribe(
      () => {
        template.hide();
        this.getEventos();
        this.toastr.success('Deletado com sucesso');
      }, error => {
        this.toastr.error(`Erro ao tentar deletar: ${ error }`);
        console.log(error);
      }
    );
  }

  openModal(template: any, evento?: Evento) {
    this.evento = evento;
    this.registerForm.reset();

    if (this.putOrPost === 'PUT') {
      this.registerForm.patchValue(this.evento);
    }

    template.show();
  }

  getEventos() {
    this.eventoService.getAllEvento().subscribe(
      ( _evento: Evento[] ) => {
        this.eventos = _evento;
        this.eventosFiltrados = this.eventos;
      }, error => {
        this.toastr.error(`Erro ao tentar consultar eventos: ${ error }`);
      }
    );
  }

  onFileChange(evento) {
    const reader = new FileReader();

    if (evento.target.files && evento.target.files.length) {
      this.file = evento.target.files;
      console.log(this.file);
    }
  }
}
