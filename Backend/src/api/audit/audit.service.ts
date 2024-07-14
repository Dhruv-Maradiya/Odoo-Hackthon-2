import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

type AuditCreateArgs = {
  userId: string;
  action: string;
  entity: string;
  message: string;
  organizationId: string;
};

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log({
    userId,
    action,
    entity,
    message,
    organizationId,
  }: AuditCreateArgs) {
    await this.prisma.audit.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        action,
        entity,
        message,
        organization: {
          connect: {
            id: organizationId,
          },
        },
      },
    });
  }

  async getLogs(organizationId: string) {
    return this.prisma.audit.findMany({
      where: {
        organizationId: organizationId,
      },
      select: {
        user: {
          select: {
            email: true,
          },
        },
        action: true,
        entity: true,
        message: true,
        createdAt: true,
      },
    });
  }
}
