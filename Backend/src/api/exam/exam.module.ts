import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { AuditModule } from '../audit/audit.module';

@Module({
  controllers: [ExamController],
  providers: [ExamService],
  imports: [AuditModule],
})
export class ExamModule {}
