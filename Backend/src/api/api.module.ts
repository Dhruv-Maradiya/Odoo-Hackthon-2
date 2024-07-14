import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EmailModule } from 'src/@core/email/email.module';
import { HttpLoggingMiddleware } from 'src/@core/middleware/http-logger.middleware';
import { ResponseMiddleware } from 'src/@core/middleware/response.middleware';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OAuth2Module } from './oauth2/oauth2.module';
import { UserModule } from './user/user.module';
import { ExamModule } from './exam/exam.module';
import { ExamPaperModule } from './exam-paper/exam-paper.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    AuthModule,
    OAuth2Module,
    UserModule,
    PrismaModule,
    EmailModule,
    ExamModule,
    ExamPaperModule,
    AuditModule,
  ],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ResponseMiddleware).forRoutes('*');
    consumer.apply(HttpLoggingMiddleware).forRoutes('*');
  }
}
