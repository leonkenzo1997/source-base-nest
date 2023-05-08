/* eslint-disable prettier/prettier */

import { DataSource } from "typeorm";

export class HealthCheckRepository {

  constructor(private dt : DataSource) {}

  public async select() {

    const a = this.dt.query("SELECT 1")

    console.log(a);
    return a
  
  }
}
