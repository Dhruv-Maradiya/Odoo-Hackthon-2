import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/constants/roles';
import { AuthService } from '../auth/auth.service';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { Role } from '../auth/decorator/role.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';
import { UserService } from './user.service';
import { AuditService } from '../audit/audit.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly auditService: AuditService,
  ) {}

  @Get('/me')
  @Role(Roles.INVIGILATOR)
  @UseGuards(JwtGuard, RoleGuard)
  async me(@GetUser('id') userId: string) {
    return await this.userService.findOne({
      id: userId,
    });
  }

  @Get('')
  @Role(Roles.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async findAll(
    @GetUser('organizationId') organizationId: string,
    @Query('pageSize') pageSize?: string,
    @Query('page') page?: string,
    @Query('search') search?: string,
  ) {
    const [users, count] = await Promise.all([
      this.userService.find({
        pagination: {
          pageSize: +pageSize || 10,
          page: +page || 0,
        },
        organizationId,
        search: search,
      }),
      this.userService.count({
        organizationId,
        search,
      }),
    ]);

    return { data: users, pagination: { count } };
  }

  @Get('/:id')
  @Role(Roles.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async findOne(
    @Param('id') id: string,
    @GetUser('organizationId') organizationId: string,
  ) {
    return await this.userService.findOne({
      id: id,
      organizationId,
    });
  }

  @Post('')
  @Role(Roles.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async create(
    @Body() data: CreateUserDto,
    @GetUser('id') userId: string,
    @GetUser('organizationId') organizationId: string,
    @GetUser('name') adminName: string,
  ) {
    this.auditService.log({
      userId,
      organizationId,
      action: 'CREATE',
      entity: 'USER',
      message: `Created user ${data.name}`,
    });

    return await this.userService.create(
      {
        name: data.name,
        email: data.email,
        enabled: data.enabled,
        role: data.role,
        organizationId,
        createdById: userId,
      },
      adminName,
    );
  }

  @Put('/:id')
  @Role(Roles.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
    @GetUser('id') userId: string,
    @GetUser('organizationId') organizationId: string,
  ) {
    this.auditService.log({
      userId,
      organizationId,
      action: 'CREATE',
      entity: 'USER',
      message: `Created user ${data.name}`,
    });

    return await this.userService.update({
      ...data,
      updatedById: userId,
      id: id,
    });
  }

  @Get('/organizations/:id')
  @Role(Roles.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async findByOrganization(
    @Param('id') id: string,
    @Query('pageSize') pageSize?: string,
    @Query('page') page?: string,
    @Query('search') search?: string,
  ) {
    const [users, count] = await Promise.all([
      this.userService.findByOrganizationId({
        organizationId: id,
        pagination: {
          pageSize: +pageSize || 10,
          page: +page || 0,
        },
        search: search,
      }),
      this.userService.count({
        organizationId: id,
        search,
      }),
    ]);

    return { data: users, pagination: { count } };
  }

  @Delete('/:id')
  @Role(Roles.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async delete(@Param('id') id: string, @GetUser('id') userId: string) {
    return await this.userService.softDelete(id, userId);
  }
}
