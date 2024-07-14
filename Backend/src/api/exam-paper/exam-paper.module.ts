import { Module } from '@nestjs/common';
import { ExamPaperController } from './exam-paper.controller';
import { ExamPaperService } from './exam-paper.service';
import { AuditModule } from '../audit/audit.module';

@Module({
  controllers: [ExamPaperController],
  providers: [ExamPaperService],
  imports: [AuditModule],
})
export class ExamPaperModule {}
