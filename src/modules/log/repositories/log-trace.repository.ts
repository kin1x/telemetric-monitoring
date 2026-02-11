import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogTraceEntity } from 'src/entities/log-trace.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogTraceRepository extends Repository<LogTraceEntity> {
  constructor(
    @InjectRepository(LogTraceEntity)
    protected repository: Repository<LogTraceEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
