import {
  IsArray,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateExamDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  @IsIn(['ONGOING', 'ARCHIVED'])
  status: string;

  @IsString()
  @IsOptional()
  @IsDateString()
  startDate: string;

  @IsString()
  @IsOptional()
  @IsDateString()
  endDate: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  invigilators: string[];
}
