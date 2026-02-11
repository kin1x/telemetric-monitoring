import { Injectable } from '@nestjs/common';
import { CreateLogDto } from '../dtos/create-log.dto';
import { LogEntity } from 'src/entities/log.entity';
import { LogRepository } from '../repositories/log.repository';
import { LogResponse } from '../responses/log.response';
import { LogTraceEntity } from 'src/entities/log-trace.entity';
import { LogTraceResponse } from '../responses/log-trace.response';
import { LogTraceDto } from '../dtos/log-trace.dto';
import { LogTraceRepository } from '../repositories/log-trace.repository';

@Injectable()
export class LogMapperService {
  constructor(
    private readonly logRepo: LogRepository,
    private readonly traceRepo: LogTraceRepository,
  ) {}

  public mapCreateTraceDtoToEntity(dto: LogTraceDto): LogTraceEntity {
    return this.traceRepo.create({
      message: dto.message,
      file: dto.file,
      line: dto.line,
      position: dto.position,
    });
  }

  public mapCreateDtoToEntity(dto: CreateLogDto): LogEntity {
    return this.logRepo.create({
      type: dto.type,
      message: dto.message,
      level: dto.level,
      factory: dto.factory,
      service: dto.service,
      environment: dto.environment,
      order: dto.order,
      traces: dto?.traces?.map((i) => this.mapCreateTraceDtoToEntity(i)) || [],
    });
  }

  public mapLogTraceEntityToResponse(entity: LogTraceEntity): LogTraceResponse {
    return {
      id: entity.id,
      message: entity.message,
      file: entity.file,
      line: entity.line,
      position: entity.position,
      log: entity.log,
    };
  }

  public mapLogEntityToResponse(entity: LogEntity): LogResponse {
    return {
      id: entity.id,
      type: entity.type,
      message: entity.message,
      level: entity.level,
      factory: entity.factory,
      service: entity.service,
      environment: entity.environment,
      order: entity.order,
      createdAt: entity.createdAt,
      token: entity.token,
      traces: entity?.traces?.map((i) => this.mapLogTraceEntityToResponse(i)) || [],
    };
  }
}