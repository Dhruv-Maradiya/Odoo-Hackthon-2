import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { Roles } from 'src/constants/roles';
import { Role } from '../auth/decorator/role.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Role(Roles.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async getLogs(@GetUser('organizationId') organizationId: string) {
    return this.auditService.getLogs(organizationId);
  }
}
