import { user_role } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsOptional()
  enabled: boolean;

  @IsOptional()
  @IsString()
  @IsIn(['ADMIN', 'INVIGILATOR', 'EXAMINER'])
  role: user_role;
}
