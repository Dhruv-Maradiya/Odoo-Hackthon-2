import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Roles } from 'src/constants/roles';
import { Role } from '../auth/decorator/role.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get()
  @Role(Roles.INVIGILATOR)
  @UseGuards(JwtGuard, RoleGuard)
  async getAll(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @GetUser('organizationId') organizationId: string,
    @GetUser('id') userId: string,
    @GetUser('role') role: string,
  ) {
    return this.examService.getAllExams({
      page: page,
      pageSize: pageSize,
      search: search,
      organizationId: organizationId,
      userId: userId,
      role: Roles[role],
    });
  }

  @Get(':id')
  @Role(Roles.INVIGILATOR)
  @UseGuards(JwtGuard, RoleGuard)
  async getById(
    @Param('id') id: string,
    @GetUser('organizationId') organizationId: string,
    @GetUser('id') userId: string,
    @GetUser('role') role: string,
  ) {
    return this.examService.getExamById({
      id: id,
      organizationId: organizationId,
      userId: userId,
      role: Roles[role],
    });
  }

  @Post()
  @Role(Roles.EXAMINER)
  @UseGuards(JwtGuard, RoleGuard)
  async create(
    @Body() data: CreateExamDto,
    @GetUser('organizationId') organizationId: string,
    @GetUser('id') userId: string,
  ) {
    return this.examService.createExam({
      data: data,
      organizationId: organizationId,
      userId: userId,
    });
  }

  @Put(':id')
  @Role(Roles.EXAMINER)
  @UseGuards(JwtGuard, RoleGuard)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateExamDto,
    @GetUser('organizationId') organizationId: string,
    @GetUser('id') userId: string,
  ) {
    return this.examService.updateExam({
      data: data,
      id: id,
      organizationId: organizationId,
      userId: userId,
    });
  }
}
