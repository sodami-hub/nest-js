import { Injectable } from '@nestjs/common';
import mysql, { PoolOptions } from 'mysql2';
import {
  drizzle,
  MySql2DrizzleConfig,
  type MySql2Database,
} from 'drizzle-orm/mysql2';

export interface DrizzleMySqlConfig {
  mysql: PoolOptions;
  config: MySql2DrizzleConfig<any>;
}

@Injectable()
export class DrizzleMySqlService {
  public getDrizzle(options: DrizzleMySqlConfig): MySql2Database<any> {
    const pool = mysql.createPool(options.mysql);
    return drizzle(pool, options.config);
  }
}
