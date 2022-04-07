import { Injectable, BadRequestException, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Categoria } from './interfaces/categoria.interface';
import { Model } from 'mongoose';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto'
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';


@Injectable()
export class CategoriasService {
    constructor(
        @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
        private readonly jogadoresService: JogadoresService
    ) {

    }
    async criarCategoria(criarCategoriaDto: CriarCategoriaDto): Promise<Categoria> {
        const { categoria } = criarCategoriaDto;
        if (await this.buscarPorCategoria(categoria)) {
            throw new BadRequestException(`Categoria ${categoria} já existente`);
        }
        const categoriaCriada = await this.categoriaModel.create(criarCategoriaDto);
        return categoriaCriada.save();
    }

    async atualizarCategoria(atualizarCategoriaDto: AtualizarCategoriaDto, idCategoria: string): Promise<void> {
        const categoriaEncontrada = await this.buscarPorId(idCategoria);
        await this.categoriaModel.findOneAndUpdate({ _id: idCategoria }, { $set: atualizarCategoriaDto }).exec();
    }

    async consultarCategorias(): Promise<Array<Categoria>> {
        return await this.categoriaModel.find().populate("jogadores").exec();
    }

    async buscarPorId(_id: string): Promise<Categoria> {
        const categoria = await this.categoriaModel.findOne({ _id }).exec();
        if (!categoria) {
            throw new NotFoundException("Categoria não encontrada");
        }
        return categoria;
    }

    async buscarPorCategoria(categoria: string): Promise<Categoria> {
        return await this.categoriaModel.findOne({ cateogria: categoria }).exec();
    }



    async associarJogadorCategoria(params: string[]): Promise<void> {
        const categoria = params['categoria'];
        const jogador = params['idJogador'];
        let categoriaEncontrada = await this.categoriaModel.findOne({categoria});
        // const jogadorJaCadastrado
        if(!categoriaEncontrada){
            throw new BadRequestException(`Categoria ${categoria} não cadastrada`);
        }
        const jogadorJaCadastradoCategoria = await this.categoriaModel.find({categoria}).where('jogadores').in(jogador).exec();
        const jogadorEncontrado = await this.jogadoresService.consultarjogadorById(jogador);

        console.log(jogadorEncontrado);
        
        if (!categoriaEncontrada)
            throw new BadRequestException("Categoria não encontrada");
        
        if (jogadorJaCadastradoCategoria.length > 0)
            throw new BadRequestException(`Jogador ${jogador} Ja cadastrado na categoria ${categoria}`);
        
        categoriaEncontrada.jogadores.push(jogador);
        await this.categoriaModel.updateOne({categoria},{$set: categoriaEncontrada}).exec();
        
    }

    public async jogadorTemCategoria(jogador:Jogador): Promise<Boolean>{
        const existe = this.categoriaModel.findOne({jogadores: [jogador]}).exec();
        return Boolean(existe);
    }

}
