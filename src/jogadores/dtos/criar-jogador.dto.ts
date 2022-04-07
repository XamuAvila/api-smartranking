import {IsNotEmpty, IsEmail} from 'class-validator'

export class CriarJogadorDto {
    readonly telefoneCelular: string;
    @IsEmail()
    readonly email: string;
    @IsNotEmpty()
    readonly nome: string;
}
