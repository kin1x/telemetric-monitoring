import { LoggerService } from 'src/modules/logger/logger.service';

export function CatchErrors() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const logger: LoggerService = this.logger;
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        logger.error(`Error in ${propertyKey}: ${error.message}`, error.stack);
        throw error;
      }
    };
    return descriptor;
  };
}