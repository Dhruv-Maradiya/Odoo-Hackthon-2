import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { oauth_providers_enum, user_role } from '@prisma/client';
import { EmailService } from 'src/@core/email/email.service';
import { setPasswordTemplate } from 'src/@core/email/templates/set-passwors';
import { APP_NAME } from 'src/constants/constants';
import { PaginationDto } from 'src/constants/dto/pagination.dto';
import {
  OAuthProvidersEnum,
  getKeyByValueOAuthProviders,
} from 'src/constants/types';
import { PrismaService } from 'src/prisma/prisma.service';

type FindArgs = {
  pagination: PaginationDto;
  organizationId: string;
  search?: string;
};

type FindOneArgs = {
  id: string;
  organizationId?: string;
};

type CreateArgs = {
  name: string;
  email: string;
  organizationId: string;
  enabled: boolean;
  createdById: string;
  role: user_role;
};

type UpdateArgs = {
  id: string;
  name?: string;
  email?: string;
  enabled?: boolean;
  updatedById: string;
  role?: user_role;
};

type CountArgs = {
  organizationId: string;
  search?: string;
};

type FindOrCreateArgs = {
  email: string;
  name: string;
  role: user_role;
  provider: OAuthProvidersEnum;
};

const defaultSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  organization: {
    select: {
      id: true,
      name: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      name: true,
    },
  },
  enabled: true,
  owner: true,
};

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async find({ pagination, organizationId, search }: FindArgs) {
    return await this.prisma.user.findMany({
      skip: pagination.page * pagination.pageSize,
      take: pagination.pageSize,
      select: defaultSelect,
      where: {
        organizationId,
        name: {
          contains: search,
        },
        deleted: false,
      },
    });
  }

  async findOne({ id, organizationId }: FindOneArgs) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        organizationId,
        deleted: false,
      },
      select: defaultSelect,
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  async create(data: CreateArgs, adminName: string) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        id: true,
        organizationId: true,
      },
    });

    let user: any;

    if (userExists) {
      if (userExists.organizationId === data.organizationId) {
        user = await this.prisma.user.update({
          where: {
            id: userExists.id,
          },
          data: {
            organization: {
              connect: {
                id: userExists.organizationId,
              },
            },
          },
          select: defaultSelect,
        });
      }

      throw new NotAcceptableException('user already exists');
    }

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          role: data.role,
          enabled: data.enabled,
          organization: {
            connect: {
              id: data.organizationId,
            },
          },
          authProviders: {
            create: {
              provider: 'LOCAL',
            },
          },
          createdBy: {
            connect: {
              id: data.createdById,
            },
          },
        },
        select: defaultSelect,
      });
    }

    this.sendInvitationEmail(user.email, adminName);

    return user;
  }

  async update(data: UpdateArgs) {
    if (data.updatedById === data.id && data.email) {
      throw new NotAcceptableException('you cannot change your email');
    }

    return await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        email: data.email,
        name: data.name,
        enabled: data.enabled,
        role: data.role,
        updatedBy: {
          connect: {
            id: data.updatedById,
          },
        },
      },
      select: defaultSelect,
    });
  }

  async findOrCreate({ email, name, role, provider }: FindOrCreateArgs) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
        role: true,
        id: true,
        authProviders: {
          select: {
            provider: true,
          },
        },
        deleted: true,
      },
    });

    const _provider = getKeyByValueOAuthProviders(provider);

    if (user) {
      if (user.deleted) {
        throw new ForbiddenException('Your email is not register with us!');
      }

      const providerExists = user.authProviders.some(
        (authProvider) => authProvider.provider === _provider,
      );

      if (!providerExists) {
        await this.prisma.oauth_providers.create({
          data: {
            provider: oauth_providers_enum[_provider],
            userId: user.id,
          },
        });
      }

      return user;
    }

    return await this.prisma.user.create({
      data: {
        email,
        name,
        role: role,
        enabled: true,
        owner: true,
        authProviders: {
          create: {
            provider: oauth_providers_enum[_provider],
          },
        },
      },
      select: {
        email: true,
        role: true,
        id: true,
      },
    });
  }

  private async sendInvitationEmail(email: string, adminName: string) {
    const tokenDetails = await this.prisma.reset_links.create({
      data: {
        email,
      },
    });

    await this.emailService.withUser('NOREPLY').sendMail({
      to: email,
      subject: `${APP_NAME} Invitation`,
      html: setPasswordTemplate(
        process.env.APP_URL,
        tokenDetails.token,
        adminName,
      ),
    });
  }

  async count({ organizationId, search }: CountArgs) {
    return await this.prisma.user.count({
      where: {
        organizationId,
        name: {
          contains: search,
        },
        deleted: false,
      },
    });
  }

  async findByOrganizationId({ organizationId, pagination, search }: FindArgs) {
    return await this.prisma.user.findMany({
      skip: pagination.page * pagination.pageSize,
      take: pagination.pageSize,
      where: {
        organizationId,
        name: {
          contains: search,
        },
        deleted: false,
      },
      select: defaultSelect,
    });
  }

  async softDelete(id: string, userId: string) {
    return await this.prisma.user.update({
      where: {
        id,
        OR: [
          {
            role: 'INVIGILATOR',
          },
          {
            createdBy: {
              id: userId,
            },
            role: 'ADMIN',
          },
        ],
      },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });
  }
}
