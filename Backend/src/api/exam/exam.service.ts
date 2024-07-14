import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { exam_status } from '@prisma/client';
import { Roles } from 'src/constants/roles';
import { AuditService } from '../audit/audit.service';

type CreateExamArgs = {
  data: CreateExamDto;
  organizationId: string;
  userId: string;
};

type UpdateExamArgs = {
  id: string;
  data: UpdateExamDto;
  userId: string;
  organizationId: string;
};

type GetExamArgs = {
  search?: string;
  page?: number;
  pageSize?: number;
  userId: string;
  role: Roles;
  organizationId: string;
};

type GetExamByIdArgs = {
  id: string;
  userId: string;
  role: Roles;
  organizationId: string;
};

type DeleteExamArgs = {
  id: string;
};

const defaultSelect = {
  id: true,
  name: true,
  description: true,
  status: true,
  startAt: true,
  endAt: true,
  organization: {
    select: {
      id: true,
      name: true,
    },
  },
  invigilators: {
    select: {
      id: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
};

@Injectable()
export class ExamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async createExam({ data, organizationId, userId }: CreateExamArgs) {
    this.auditService.log({
      userId,
      action: 'create',
      entity: 'exam',
      message: `Created exam ${data.name}`,
      organizationId,
    });

    return this.prisma.exam.create({
      data: {
        name: data.name,
        endAt: new Date(data.endDate),
        startAt: new Date(data.startDate),
        description: data.description,
        status: exam_status[data.status] as exam_status,
        invigilators: {
          createMany: {
            data: data.invigilators.map((invigilatorId) => ({
              userId: invigilatorId,
            })),
          },
        },
        organization: {
          connect: {
            id: organizationId,
          },
        },
        createdBy: {
          connect: {
            id: userId,
          },
        },
        updatedBy: {
          connect: {
            id: userId,
          },
        },
      },
      select: defaultSelect,
    });
  }

  async getExamById({ id, organizationId, role, userId }: GetExamByIdArgs) {
    let invigilators = {};

    if (role === Roles.INVIGILATOR) {
      invigilators = {
        some: {
          userId,
        },
      };
    }

    const exam = await this.prisma.exam.findUnique({
      where: { id, organizationId, invigilators },
      select: defaultSelect,
    });

    return exam;
  }

  async getAllExams({
    search,
    page,
    pageSize,
    organizationId,
    role,
    userId,
  }: GetExamArgs) {
    let invigilators = {};

    if (role === Roles.INVIGILATOR) {
      invigilators = {
        some: {
          userId,
        },
      };
    }

    const [exams, count] = await Promise.all([
      this.prisma.exam.findMany({
        select: defaultSelect,
        where: {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
          organizationId,
          invigilators: invigilators,
        },
        skip: page * pageSize || 0,
        take: pageSize || 10,
      }),
      this.count({ search }),
    ]);

    return { exams, count };
  }

  async updateExam({ data, id, userId, organizationId }: UpdateExamArgs) {
    this.auditService.log({
      userId: userId,
      action: 'update',
      entity: 'exam',
      message: `Updated exam ${data.name}`,
      organizationId: organizationId,
    });

    return this.prisma.exam.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        status: exam_status[data.status],
        startAt: new Date(data.startDate),
        endAt: new Date(data.endDate),
        invigilators: {
          deleteMany: {
            userId: {
              notIn: data.invigilators,
            },
          },
          createMany: {
            data: data.invigilators.map((invigilatorId) => ({
              userId: invigilatorId,
            })),
            skipDuplicates: true,
          },
        },
        updatedBy: {
          connect: {
            id: userId,
          },
        },
      },
      select: defaultSelect,
    });
  }

  async deleteExam({ id }: DeleteExamArgs) {
    return this.prisma.exam.delete({ where: { id } });
  }

  async count({ search }: Partial<GetExamArgs>) {
    return this.prisma.exam.count({
      where: {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      },
    });
  }
}
