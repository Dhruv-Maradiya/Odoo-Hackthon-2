import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExamPaperDto } from './dto/create-exam-paper.dto';
import { UpdateExamPaperDto } from './dto/update-exam-paper.dto';
import { AuditService } from '../audit/audit.service';

type CreateExamPaperArgs = {
  data: CreateExamPaperDto;
  organizationId: string;
  userId: string;
};

type GetExamByIdArgs = {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
};

type GetAllExamsArgs = {
  page?: number;
  pageSize?: number;
  search: string;
  organizationId: string;
  userId: string;
  role: string;
  examId: string;
};

type UpdateExamPaperArgs = {
  data: UpdateExamPaperDto;
  id: string;
  userId: string;
  organizationId: string;
};

type DeleteExamPaperArgs = {
  id: string;
};

const defaultSelect = {
  id: true,
  name: true,
  accessEnd: true,
  accessStart: true,
  exam: {
    select: {
      id: true,
      name: true,
    },
  },
  url: true,
};

@Injectable()
export class ExamPaperService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getAllExamPaper({
    page,
    pageSize,
    search,
    organizationId,
    role,
    userId,
    examId,
  }: GetAllExamsArgs) {
    const exam = {};
    const whereData = {};

    if (role === 'INVIGILATOR') {
      exam['invigilators'] = {
        some: {
          userId: userId,
        },
      };
      whereData['accessEnd'] = {
        gte: new Date(),
      };
      whereData['accessStart'] = {
        lte: new Date(),
      };
    }

    const [papers, count] = await Promise.all([
      this.prisma.exam_paper.findMany({
        where: {
          name: {
            contains: search,
          },
          organizationId,
          exam: exam,
          examId,
          ...whereData,
        },
        take: pageSize || undefined,
        skip: (page - 1) * pageSize || undefined,
        select: defaultSelect,
      }),
      this.prisma.exam_paper.count({
        where: {
          name: {
            contains: search,
          },
          examId,
          organizationId,
          exam: exam,
        },
      }),
    ]);

    return { papers, count };
  }

  async getExamPaperById({
    id,
    organizationId,
    role,
    userId,
  }: GetExamByIdArgs) {
    const exam = {};

    if (role === 'INVIGILATOR') {
      exam['invigilators'] = {
        some: {
          userId: userId,
        },
      };
    }

    const paper = await this.prisma.exam_paper.findUnique({
      where: {
        id: id,
        organizationId: organizationId,
        exam: exam,
      },
      select: defaultSelect,
    });

    return paper;
  }

  createExamPaper({ data, organizationId, userId }: CreateExamPaperArgs) {
    this.auditService.log({
      userId: userId,
      organizationId: organizationId,
      entity: 'EXAM_PAPER',
      action: 'CREATE',
      message: `Created exam paper ${data.name}`,
    });
    return this.prisma.exam_paper.create({
      data: {
        accessEnd: data.accessEndTime,
        accessStart: data.accessStartTime,
        name: data.name,
        exam: {
          connect: {
            id: data.examId,
          },
        },
        organization: {
          connect: {
            id: organizationId,
          },
        },
        url: data.url,
      },
      select: defaultSelect,
    });
  }

  updateExamPaper({ data, id, userId, organizationId }: UpdateExamPaperArgs) {
    this.auditService.log({
      userId: userId,
      organizationId: organizationId,
      entity: 'EXAM_PAPER',
      action: 'UPDATE',
      message: `Updated exam paper ${data.name}`,
    });

    return this.prisma.exam_paper.update({
      where: {
        id: id,
      },
      data: {
        accessEnd: data.accessEndTime,
        accessStart: data.accessStartTime,
        name: data.name,
      },
      select: defaultSelect,
    });
  }

  deleteExamPaper({ id }: DeleteExamPaperArgs) {
    return this.prisma.exam_paper.delete({
      where: {
        id: id,
      },
    });
  }
}
