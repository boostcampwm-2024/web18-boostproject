import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston/dist/winston.utilities';
import { ClsService } from 'nestjs-cls';

const winstonLoggerTransport = (clsService: ClsService) => {
  const format = winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    winston.format((info) => {
      info.message = `[${clsService.getId()}] ${info.message}`;
      return info;
    })(),
    nestWinstonModuleUtilities.format.nestLike('inear', {
      colors: true,
      prettyPrint: true,
    }),
  );
  return new winston.transports.Console({ format: format });
};
export { winstonLoggerTransport };
