import { Palestrante } from './Palestrante';
import { RedeSocial } from './RedeSocial';
import { Lote } from './Lote';

export interface Evento {
  id: number;
  tema: string;
  local: string;
  dataEvento: Date;
  qtdPessoas: number;
  imagemURL: string;
  telefone: string;
  email: string;
  lotes: Lote[];
  redesSociais: RedeSocial[];
  palestrantesEventos: Palestrante[];
}
