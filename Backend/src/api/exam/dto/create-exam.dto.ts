import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['ONGOING', 'ARCHIVED'])
  status: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsArray()
  @IsString({ each: true })
  invigilators: string[];
}
