import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateExamPaperDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  examId: string;

  @IsString()
  @IsDateString()
  accessStartTime: string;

  @IsString()
  @IsDateString()
  accessEndTime: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}
