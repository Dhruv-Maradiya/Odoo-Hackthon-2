import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/constants/roles';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { Role } from '../auth/decorator/role.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { CreateExamPaperDto } from './dto/create-exam-paper.dto';
import { UpdateExamPaperDto } from './dto/update-exam-paper.dto';
import { ExamPaperService } from './exam-paper.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Controller('exam-paper')
export class ExamPaperController {
  constructor(private readonly examPaperService: ExamPaperService) {}

  @Get()
  @Role(Roles.INVIGILATOR)
  @UseGuards(JwtGuard, RoleGuard)
  async getAll(
    @Query('search') search: string,
    @Query('examId') examId: string,
    @GetUser('organizationId') organizationId: string,
    @GetUser('id') userId: string,
    @GetUser('role') role: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.examPaperService.getAllExamPaper({
      page: page,
      pageSize: pageSize,
      search: search,
      organizationId,
      userId: userId,
      role,
      examId: examId,
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
    return this.examPaperService.getExamPaperById({
      id: id,
      organizationId: organizationId,
      userId: userId,
      role,
    });
  }

  @Post()
  @Role(Roles.EXAMINER)
  @UseGuards(JwtGuard, RoleGuard)
  async create(
    @Body() data: CreateExamPaperDto,
    @GetUser('organizationId') organizationId: string,
    @GetUser('id') userId: string,
  ) {
    return this.examPaperService.createExamPaper({
      data: data,
      organizationId: organizationId,
      userId: userId,
    });
  }

  @Post('upload')
  @Role(Roles.EXAMINER)
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'File uploaded successfully',
      url: file.filename,
    };
  }

  @Put(':id')
  @Role(Roles.EXAMINER)
  @UseGuards(JwtGuard, RoleGuard)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateExamPaperDto,
    @GetUser('organizationId') organizationId: string,
    @GetUser('id') userId: string,
  ) {
    return this.examPaperService.updateExamPaper({
      data: data,
      id: id,
      organizationId: organizationId,
      userId: userId,
    });
  }
}
