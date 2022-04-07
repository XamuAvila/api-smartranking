import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class ValidacaoParametrosPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if(!value){
            throw new BadRequestException(`The value of the parameter ${metadata.data} must be filled`)
        }
        return value;
    }
}
