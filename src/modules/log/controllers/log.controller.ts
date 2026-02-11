import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { IHttpResponse } from 'src/common/interfaces/http-response.interface';
import { LogService } from '../services/log.service';
import { UUID_V4_REGEX_STR } from 'src/common/constants/uuid-v4-regex';
import { UuidV4Type } from 'src/common/types/uuid-v4.type';
import { LogResponse } from '../responses/log.response';
import { CreateLogDto } from '../dtos/create-log.dto';
import { QueryPagination } from 'src/common/decorators/query-pagination.decorator';
import { IPaginationOptions } from 'src/common/interfaces/pagination-options.interface';
import { getPaginationResponse } from 'src/common/helpers/get-pagination-response.helper';
import { QuerySorting } from 'src/common/decorators/query-sorting.decorator';
import { IWithCount } from 'src/common/interfaces/with-count.interface';
import { ISortOptions } from 'src/common/interfaces/sort-options.interface';
import { UpdateLogDto } from '../dtos/update-log.dto';
import { FindManyLogsQueryDto } from '../dtos/find-many-logs-query.dto';

// Контроллер для работы с логами
@Controller()
@UseInterceptors(ClassSerializerInterceptor, ResponseInterceptor)
export class LogController {
  constructor(private readonly api: LogService) {}

  // Метод для получения лога по uuid
  @Get(`logs/:uuid(${UUID_V4_REGEX_STR})`)
  @HttpCode(HttpStatus.OK)
  public async getOne(
    @Param('uuid') uuid: UuidV4Type,
  ): Promise<IHttpResponse<LogResponse>> {
    // Метрики: GET /logs/:uuid (время отклика, запросы, ошибки)
    const item: LogResponse = await this.api.getOne(uuid);
    return {
      message: 'Log item found',
      item,
    };
  }

  // Метод для получения списка логов
  @Get('logs')
  @HttpCode(HttpStatus.OK)
  public async getMany(
    @QueryPagination({ defaultPageSize: 20 })
    paginationOptions: IPaginationOptions,
    @QuerySorting({
      sortOptions: ['createdAt', 'order'],
    })
    sortOptions: ISortOptions<'createdAt' | 'order'>,
  ): Promise<IHttpResponse<LogResponse>> {
    // Метрики: GET /logs (время отклика, запросы, ошибки)
    const query: FindManyLogsQueryDto = {
      page: paginationOptions.page,
      limit: paginationOptions.pageSize,
      search: '', // Add a default or extract from query params if needed
    };
    const result: IWithCount<LogResponse> = await this.api.getMany(
      paginationOptions,
      { ...sortOptions, sortBy: sortOptions.sortBy as 'createdAt' | 'order' },
      query,
    );
    return {
      message: 'Log items list',
      items: result.items,
      ...getPaginationResponse(paginationOptions, result.totalCount),
    };
  }

  // Метод для создания лога
  @Post('logs')
  @HttpCode(HttpStatus.CREATED)
  public async createOne(
    @Body() dto: CreateLogDto,
  ): Promise<IHttpResponse<LogResponse>> {
    // Метрики: POST /logs (время отклика, запросы, ошибки)
    const item: LogResponse = await this.api.createOne(dto);
    return {
      message: 'Log item created',
      item,
    };
  }

  // Метод для обновления лога
  @Patch(`logs/:uuid(${UUID_V4_REGEX_STR})`)
  @HttpCode(HttpStatus.OK)
  public async updateOne(
    @Param('uuid') uuid: UuidV4Type,
    @Body() dto: UpdateLogDto,
  ): Promise<IHttpResponse<LogResponse>> {
    // Метрики: PATCH /logs/:uuid (время отклика, запросы, ошибки)
    const item: LogResponse = await this.api.updateOne(uuid, dto);
    return {
      message: 'Log item updated',
      item,
    };
  }

  // Метод для удаления лога
  @Delete(`logs/:uuid(${UUID_V4_REGEX_STR})`)
  @HttpCode(HttpStatus.OK)
  public async deleteOne(
    @Param('uuid') uuid: UuidV4Type,
  ): Promise<IHttpResponse<LogResponse>> {
    // Метрики: DELETE /logs/:uuid (время отклика, запросы, ошибки)
    const item: LogResponse = await this.api.deleteOne(uuid);
    return {
      message: 'Log item deleted',
      item,
    };
  }
}