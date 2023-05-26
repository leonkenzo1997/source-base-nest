import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { IDecryptData } from './../interfaces/decrypt-data.interfaces';

@Injectable()
export class EncryptService {
  constructor() {
    // empty
  }

  public async decrypt(data: string): Promise<IDecryptData> {
    // Decrypt
    let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_ENCRYPT_KEY);

    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    let result = JSON.parse(originalText);
    // if (result.lightingStatus) {
    //   if (
    //     result.lightingStatus != LIGHT_STATUS.ON &&
    //     result.lightingStatus != LIGHT_STATUS.OFF
    //   ) {
    //     throw new HttpException('FORBIDDEN', HttpStatus.BAD_REQUEST);
    //   }
    // }

    return result;
  }

  public encrypt(data: any): any {
    // Encrypt
    let ciphertext: any = CryptoJS.AES.encrypt(
      data,
      process.env.SECRET_ENCRYPT_KEY,
    ).toString();
    return ciphertext;
  }
}
