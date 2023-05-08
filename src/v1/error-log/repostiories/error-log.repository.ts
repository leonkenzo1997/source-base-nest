import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseRepository } from "../../../base/base.repository";
import { ErrorLog } from "../entities/error-log.entity";

export class ErrorLogRepository extends BaseRepository<ErrorLog> {
    constructor(
      @InjectRepository(ErrorLog) private readonly _repository: Repository<ErrorLog>,
    ) {
      super(_repository);
    }
  }