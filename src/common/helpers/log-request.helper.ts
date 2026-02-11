import { Logger } from '@nestjs/common';
import { getIpFromHeadersHelper } from './get-ip-from-headers.helper';

const filteredPaths: string[] = ['/api/logs/frontend/analytics/'];

export function logRequestHelper(
  id: string,
  request: any,
  statusCode: number,
  data: any,
): void {
  const logger = new Logger(id);
  const charsLimit: number = 1024;
  const ip: string = getIpFromHeadersHelper(
    request?.headers,
    request?.headers['host'],
    'unknown',
  );
  const date: string = new Date(Date.now() + 18000000).toISOString();
  const method: string = request.method;
  const path: string = request.url;
  if (filteredPaths.includes(path)) return;
  const params: string =
    JSON.stringify(request?.params || {}).substring(0, charsLimit) || 'none';
  const body: string =
    JSON.stringify(request?.body || {}).substring(0, charsLimit) || 'none';
  const responseText: string =
    JSON.stringify(data || {}).substring(0, charsLimit) || 'none';
  const logMessage: string = `[${date}] (${statusCode}) Client ${ip} ${method} ${path} :: params: ${params}; body: ${body}; response: ${responseText}`;
  if (String(statusCode).startsWith('2')) {
    logger.log(logMessage);
  } else {
    logger.warn(logMessage);
  }
}
