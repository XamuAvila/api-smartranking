import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';
@Controller('api/v1/jogadores')
export class JogadoresController {

    constructor(private readonly jogadoresService: JogadoresService) {
    }

    @Post()
    @UsePipes(ValidationPipe)
    async criar(@Body() criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
        return await this.jogadoresService.criarJogador(criaJogadorDto);
    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async atualizarJogador(
        @Body() atualizarJogadorDto: AtualizarJogadorDto, 
        @Param('_id', ValidacaoParametrosPipe) _id:string):Promise<void>{
        await this.jogadoresService.atualizarJogador(atualizarJogadorDto, _id);
    }

    @Get()
    async consultarJogadores(): Promise<Jogador[]> {
        return await this.jogadoresService.consultarTodosJogadores();
    }

    @Get('/:_id')
    async consultarJogadorById(@Param('_id', ValidacaoParametrosPipe) _id: string): Promise<Jogador> {
        return await this.jogadoresService.consultarjogadorById(_id);
    }

    @Delete('/:_id')
    async deletarJogador(@Param('_id', ValidacaoParametrosPipe) _id: string): Promise<void> {
        await this.jogadoresService.deletarJogador(_id);
    }
}
