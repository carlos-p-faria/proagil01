import { EventoService } from './../_services/evento.service';
import { Component, OnInit } from '@angular/core';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { defineLocale, BsLocaleService, ptBrLocale} from 'ngx-bootstrap';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})

export class EventosComponent implements OnInit {
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
  _filtroLista = '';

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private fb: FormBuilder,
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
            this.eventoService.postEvento(this.evento).subscribe(
              (novoEvento: Evento) => {
                console.log(novoEvento);
                template.hide();
                this.getEventos();
              }, error => {
                console.log(error);
              }
              );
            } else {
              this.evento = Object.assign({ id: this.evento.id }, this.registerForm.value);
              this.eventoService.putEvento(this.evento).subscribe(
                () => {
                  template.hide();
                  this.getEventos();
                }, error => {
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
          this.openModal(template);
          this.evento = evento;
          this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
        }

        confirmeDelete(template: any) {
          this.eventoService.deleteEvento(this.evento).subscribe(
            () => {
                template.hide();
                this.getEventos();
              }, error => {
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
              console.log(error);
            }
            );
          }
        }
