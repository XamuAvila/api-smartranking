import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Desafio } from './interfaces/desafio.interface';
import { Model } from 'mongoose';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CategoriasService } from 'src/categorias/categorias.service';

@Injectable()
export class DesafiosService {
    constructor(@InjectModel('Desafio') private readonly desafio: Model<Desafio>,
                private readonly jogadoresService: JogadoresService,
                private readonly categoriaService: CategoriasService) {}

    async criarDesafio(desafioDto:CriarDesafioDto){
        const novoDesafio = await this.buscarDesafio(desafioDto);
        this.validarJogadores(novoDesafio.jogadores);
        this.categoriaService.jogadorTemCategoria(desafioDto.solicitante);
        if(desafioDto.jogadores.includes(desafioDto.solicitante)){
            throw new BadRequestException("O Jogador não pode desafiar a si mesmo");
        }
    }

    async buscarDesafio(desafioDto:CriarDesafioDto):Promise<Desafio>{
        const desafioEncontrado = await this.desafio.findOne(desafioDto).exec();
        if(desafioEncontrado){
            throw new BadRequestException("Desafio já cadastrado");
        }
        return desafioEncontrado;
    }

    private async validarJogadores(jogadoresDesafio:Array<Jogador>): Promise<void>{
        const jogadores = await this.jogadoresService.consultarTodosJogadores();
        if(!jogadores.some(r=>jogadoresDesafio.includes(r))){
            throw new BadRequestException("Algum jogador está inválido");
        }
    }

    private async solicitanteTemCategoria(solicitante:Jogador):Promise<void>{
        const categorias = this.categoriaService.
    }
}
