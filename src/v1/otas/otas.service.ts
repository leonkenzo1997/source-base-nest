import { ConnectAzure } from './../../utils/connect-azure.service';
import {
  BlobSASPermissions,
  BlobServiceClient,
  BlockBlobClient,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { BadRequestException, Injectable } from '@nestjs/common';
import { In, Like } from 'typeorm';
import { IPagination } from '../../interfaces/pagination.interface';
import { PaginationService } from '../../utils/pagination.service';
import { GetBuildingDto } from '../buildings/dto/get-buildings.dto';
import { DeviceTypesService } from '../device-types/device-types.service';
import { CreateOtaDto } from './dto/create-otas.dto';
import { DeleteOtaDto } from './dto/delete-otas.dto';
import { Ota } from './entities/ota.entity';
import { IOta } from './interfaces/ota.interface';
import { OTA_RELATION, OTA_SELECT } from './ota.const';
import { OtasRepository } from './repositories/otas.repository';
@Injectable()
export class OtasService {
  constructor(
    private readonly deviceTypesService: DeviceTypesService,
    private readonly otasRepository: OtasRepository,
    private paginationService: PaginationService,
    private connectAzure : ConnectAzure
  ) {}

  /**
   * this method is upload file ota for the Azure
   *
   * @param file Express.Multer.File
   * @param createOtaDto CreateOtaDto
   * @returns any
   */
  public async uploadFile(
    file: Express.Multer.File,
    createOtaDto: CreateOtaDto,
  ): Promise<any> {
    // check file is empty
    if (!file || file === null) {
      throw new BadRequestException('FILE_EMPTY');
    } else {
      const arrayFileName = file.originalname.split('.');

      // check type file upload is file zip
      if (
        !file.mimetype.includes('zip') &&
        arrayFileName[arrayFileName.length - 1] != 'gbl'
      ) {
        throw new BadRequestException('FILE_INVALID');
      } else {
        const deviceType = await this.deviceTypesService.findbyId(
          createOtaDto.deviceType,
        );
        // check device type is empty
        if (!deviceType) {
          throw new BadRequestException('DEVICE_TYPE_NOT_FOUND');
        }
        // check name and version is already
        for (let ota of deviceType.otas) {
          if (ota.version === createOtaDto.version) {
            throw new BadRequestException('VERSION_NAME_ALREADY');
          }
        }
        const ota = await this.otasRepository.findOne({
          fileName: createOtaDto.fileName,
        });
        if (ota || ota != null) {
          throw new BadRequestException('VERSION_NAME_ALREADY');
        }

        const [token, url] = this.connectAzure.createSasKey(createOtaDto.fileName);
        return { url: url, sasToken: token };
      }
    }
  }

  /**
   * this method is show list ota of device
   *
   * @param deviceTypeId number
   * @param getOtasDTO GetBuildingDto
   * @returns IPagination
   */
  public async listOtaFromDeviceType(
    deviceTypeId: number,
    getOtasDTO: GetBuildingDto,
  ): Promise<IPagination> {
    //check select device true
    try {
      const page = getOtasDTO.page ? getOtasDTO.page : 1;
      const limit = getOtasDTO.limit ? getOtasDTO.limit : 10;
      const sortType = getOtasDTO.sortType;
      const sortBy = getOtasDTO.sortBy ? getOtasDTO.sortBy : '';
      const keyword = getOtasDTO.keyword;
      const skip = (page - 1) * limit;
      let order = {};
      let where = {};

      if (getOtasDTO.keyword) {
        where['name'] = Like(`%${keyword}%`);
      }

      if (deviceTypeId) {
        where = {
          ...where,
          deviceType: { id: deviceTypeId },
        };
      }

      if (sortBy) {
        order = {
          [sortBy]: sortType,
        };
      } else {
        order = {
          id: sortType,
        };
      }
      const [otas, total] = await this.otasRepository.findAndCount(
        where,
        OTA_RELATION,
        OTA_SELECT,
        limit,
        skip,
        order,
      );

      const result = this.paginationService.pagination(
        otas,
        total,
        page,
        limit,
      );

      return result;
    } catch (error) {
      throw new BadRequestException('INVALID_DATA');
    }
  }

  /**
   * this method is find new version ota of device
   *
   * @param deviceId number
   * @returns any
   */
  public async newVersion(deviceId: number): Promise<any> {
    const device = await this.deviceTypesService.findbyId(deviceId);
    // check device null
    if (device === null || !device) {
      throw new BadRequestException('DEVICE_TYPE_NOT_FOUND');
    }

    const ota = await this.otasRepository.findNewVersion(deviceId);
    return ota;
  }

  /**
   * the method is delete ota
   *
   * @param otaIds DeleteOtaDto
   * @returns any
   */
  public async deleteOtas(otaIds: DeleteOtaDto): Promise<any> {
    let newOtaIds: any[] = [];
    await Promise.all(
      otaIds.ids.map((id: any) => {
        newOtaIds.push(id.id);
      }),
    );
    const ota = await this.otasRepository.find({ id: In(newOtaIds) });

    if (ota.length != newOtaIds.length) {
      throw new BadRequestException('DELETE_FAILED');
    }

    for (let item of ota) {
      let blockBlobClient = this.connectAzure.getBlobClient(item.fileName);
      if (await blockBlobClient.deleteIfExists()) {
        let result = this.otasRepository.softDelete({ id: item.id });
      }
    }

    return;
  }

  /**
   * this method create ota database
   *
   * @param createOtaDto CreateOtaDto
   * @returns Ota
   */
  public async createOtas(createOtaDto: CreateOtaDto): Promise<Ota> {
    const deviceType = await this.deviceTypesService.findbyId(
      createOtaDto.deviceType,
    );
    // check device type is empty
    if (!deviceType) {
      throw new BadRequestException('DEVICE_TYPE_NOT_FOUND');
    }
    // check name and version is already
    for (let ota of deviceType.otas) {
      if (ota.version === createOtaDto.version) {
        throw new BadRequestException('VERSION_NAME_ALREADY');
      }
    }
    const ota = await this.otasRepository.findOne({
      fileName: createOtaDto.fileName,
    });
    if (ota || ota != null) {
      throw new BadRequestException('VERSION_NAME_ALREADY');
    }

    const blockBlobClient = this.connectAzure.getBlobClient(createOtaDto.fileName);
    try {
      let test = await blockBlobClient.downloadToBuffer();
      const otaCreate = {
        ...createOtaDto,
        deviceType: { id: deviceType.id },
      };
      const result = await this.otasRepository.create(otaCreate);
      return result;
    } catch (error) {
      throw new BadRequestException('CREATE_FAILED');
    }
  }

  /**
   * this method is download file ota
   * @param id number
   * @returns any
   */
  public async downloadOtas(id: number): Promise<any> {
    const ota = await this.otasRepository.findOne({ id: id });
    if (!ota || ota === null) {
      throw new BadRequestException('OTA_NOT_FOUND');
    }

    try {
      const [token, url] = this.connectAzure.createSasKey(ota.fileName);

      return { sasToken: token, url: url };
    } catch (error) {
      throw new BadRequestException('DOWNLOAD_FAIL');
    }
  }
  /**
   * this method is upload file ota directly for the Azure
   *
   * @param file Express.Multer.File
   * @param createOtaDto CreateOtaDto
   * @returns IOta
   */
  public async uploadFileDirectly(
    file: Express.Multer.File,
    createOtaDto: CreateOtaDto,
  ): Promise<IOta> {
    // check file is empty
    if (!file || file === null) {
      throw new BadRequestException('FILE_EMPTY');
    } else {
      const arrayFileName = file.originalname.split('.');

      // check type file upload is file zip
      if (
        !file.mimetype.includes('zip') &&
        arrayFileName[arrayFileName.length - 1] != 'gbl'
      ) {
        throw new BadRequestException('FILE_INVALID');
      } else {
        const deviceType = await this.deviceTypesService.findbyId(
          createOtaDto.deviceType,
        );
        // check device type is empty
        if (!deviceType) {
          throw new BadRequestException('DEVICE_TYPE_NOT_FOUND');
        }
        // check name and version is already
        for (let ota of deviceType.otas) {
          if (ota.version === createOtaDto.version) {
            throw new BadRequestException('VERSION_NAME_ALREADY');
          }
        }
        const ota = await this.otasRepository.findOne({
          fileName: createOtaDto.fileName,
        });
        if (ota || ota != null) {
          throw new BadRequestException('VERSION_NAME_ALREADY');
        }

        try {
          // upload the file to the Azure
          const blobClient = this.connectAzure.getBlobClient(createOtaDto.fileName);
          await blobClient.uploadData(file.buffer, {
            blobHTTPHeaders: { blobContentType: file.mimetype },
          });
          const dataCreate = {
            ...createOtaDto,
            deviceType: { id: createOtaDto.deviceType },
          };
          const result = await this.otasRepository.create(dataCreate);
          return result;
        } catch (error) {
          throw new BadRequestException('UPLOAD_FILE_FAIL');
        }
      }
    }
  }

  /**
   * This function get list new version ota
   *
   * @returns any
   */
  public async getListNewVersion(): Promise<any> {
    const listDeviceType = await this.deviceTypesService.find(null);

    let arrayOta: any[] = [];

    for (let deviceType of listDeviceType) {
      let ota = await this.otasRepository.findNewVersion(deviceType.id);
      arrayOta.push(ota[0]);
    }

    return arrayOta;
  }
}
