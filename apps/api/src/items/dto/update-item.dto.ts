import { PartialType } from '@nestjs/swagger'; // Or @nestjs/mapped-types if swagger is not used for this
import { CreateItemDto } from './create-item.dto';

export class UpdateItemDto extends PartialType(CreateItemDto) {}
