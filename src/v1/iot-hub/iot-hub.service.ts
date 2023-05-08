// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Injectable } from '@nestjs/common';
import { Client, Message } from 'azure-iot-device';
import { clientFromConnectionString } from 'azure-iot-device-http';
import * as util from 'util';

@Injectable()
export class IotHubService {
  public async connectIotHub(deviceId: string) {
    // String containing Hostname, Device Id & Device Key in the following formats:
    //  "HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"
    const hostName = process.env.IOTHUB_HOSTNAME;
    const symmetricKey = process.env.IOTHUB_SHARED_ACCESS_KEY;
    const sharedAccessKeyName = process.env.IOTHUB_SHARED_ACCESS_KEY_NAME;
    const deviceConnectionString: string = util.format(
      'HostName=%s;DeviceId=%s;SharedAccessKeyName=%s;SharedAccessKey=%s',
      hostName,
      deviceId,
      sharedAccessKeyName,
      symmetricKey,
    );

    if (deviceConnectionString === '') {
      console.log('device connection string not set');
      process.exit(-1);
    }

    const client: Client = clientFromConnectionString(deviceConnectionString);

    client.open((err) => {
      if (err) {
        console.error('Could not connect: ' + err.message);
      } else {
        console.log('Client connected');
      }
    });

    // Create two messages and send them to the IoT hub as a batch.
    const data = JSON.stringify({
      Protocol_Type: 'Set_NonAck',
      Protocol_Data: 'AT+010001FFFFFF01190105E3',
    });
    const message = new Message(data);

    client.sendEvent(message, (err, res) => {
      if (err) {
        console.error('Could not send message: ' + err.message);
      } else {
        console.log('Message sent.');
        console.log(
          'send status:' +
            res.transportObj.statusCode +
            ' ' +
            res.transportObj.statusMessage,
        );
      }
    });

    client.close((err) => {
      if (err) {
        console.error('Could not close connection: ' + err.message);
      } else {
        console.log('Connection closed.');
      }
    });
  }
}
