import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateExamPaperDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsDateString()
  @IsOptional()
  accessStartTime: string;

  @IsString()
  @IsDateString()
  @IsOptional()
  accessEndTime: string;
}
