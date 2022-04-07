import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Controller('api/v1/categorias')
export class CategoriasController 
{ 
    constructor(private readonly categoriasService: CategoriasService){

    }
    @UsePipes(ValidationPipe)
    @Post()
    async criarCategoria(@Body() criarCategoriaDto:CriarCategoriaDto): Promise<Categoria>{
        return await this.categoriasService.criarCategoria(criarCategoriaDto);
    }

    @Get()
    async consultarCategorias():Promise<Array<Categoria>>{
        return await this.categoriasService.consultarCategorias();
    }

    @Get('/:_id')
    async consultarCategoria(@Param('_id') _id:string):Promise<Categoria>{
        return this.categoriasService.buscarPorCategoria(_id);
    }

    @Put('/:idCategoria')
    @UsePipes(ValidationPipe)
    async atualizaCategoria(@Body() atualizarCategoriaDto:AtualizarCategoriaDto, @Param('idCategoria') idCategoria:string){
        await this.categoriasService.atualizarCategoria(atualizarCategoriaDto, idCategoria);
    }

    @Post("/:categoria/jogadores/:idJogador")
    async adicionarJogadorCategoria(@Param() params:string[]) : Promise<void>{
        console.log(params);
        return await this.categoriasService.associarJogadorCategoria(params);
    }


}
