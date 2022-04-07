import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Injectable()
export class JogadoresService {
    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {

    }
    private readonly logger = new Logger(JogadoresService.name);

    async criarJogador(CriarJogadorDto: CriarJogadorDto): Promise<Jogador> {
        this.logger.log(`criando o jogador dto: ${CriarJogadorDto}`)
        
        const jogadorEncontrado = await this.jogadorModel.findOne({ email:CriarJogadorDto.email }).exec();
        if(jogadorEncontrado){
            throw new BadRequestException(`Jogador de email ${CriarJogadorDto.email} já cadastrado`);
        }
        const jogadorCriado = new this.jogadorModel(CriarJogadorDto);
        return await jogadorCriado.save();
    }

    async atualizarJogador(atualizarJogadorDto: AtualizarJogadorDto, _id:string): Promise<void> {
        this.logger.log(`Atualizando o jogador dto: ${atualizarJogadorDto}`)
        const jogadorEncontrado = await this.jogadorModel.findOne({ _id:_id }).exec();
        if (!jogadorEncontrado) {
            throw new NotFoundException(`Jogador de ID ${_id} não encontrado`);
        }else{
            await this.jogadorModel.findOneAndUpdate({ _id: _id }, { $set: atualizarJogadorDto }).exec();
        }

    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return await this.jogadorModel.find().exec();
    }

    async consultarjogadorById(id:string): Promise<Jogador> {
        const jogadorEncontrado = await this.jogadorModel.findById({_id:id}).exec();

        if(!jogadorEncontrado){
            throw new NotFoundException("Jogador não encontrado");
        }
        return jogadorEncontrado;
    }

    async deletarJogador(_id): Promise<any> {
        const jogadorEncontrado = await this.jogadorModel.findOne({_id:_id});
        if(!jogadorEncontrado){
            throw new NotFoundException("Jogador não encontrado");
        }
        return await this.jogadorModel.deleteOne({ _id: _id });
    }
}
