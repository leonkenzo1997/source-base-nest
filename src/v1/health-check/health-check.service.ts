import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthCheckService {
  constructor(private dataSource: DataSource) {}

  /**
   * This function health check source code
   *
   * @returns any
   */
  public async select(): Promise<any> {
    const dt = this.dataSource.query('SELECT 1');
    return !!dt;
  }
}
