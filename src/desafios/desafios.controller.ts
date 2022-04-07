import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';

@Controller('desafios')
export class DesafiosController {
    constructor(private readonly desafioService: DesafiosService) { }
    @UsePipes(ValidationPipe)
    @Post()
    async criarDesafio(@Body() desafio: CriarDesafioDto): Promise<Desafio> {
        const desafioCriado = await this.desafioService.criarDesafio(desafio);
        return;
    }
}
