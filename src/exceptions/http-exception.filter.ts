import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	async catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const i18n = getI18nContextFromArgumentsHost(host);

		const status = exception.getStatus();
		const responseBody: any = exception.getResponse();
		let messages: any;
		let codeMsg: any[] = [];
		let errors: any[] = exception['errors'];
		let messageError: any[] = [];

		if (errors?.length > 0) {
			// hanlde error i18n dto
			await Promise.all(
				errors.map(async (item: any) => {
					let data = await this.handleErrors(i18n, item);
					messageError.push(data);
					let children = item.children;
					if (children.length > 0) {
						messageError = await this.checkChildrenField(i18n, children, messageError);
					}
				}),
			);
			let newMessageError: any[] = [];
			await Promise.all(
				messageError.map((msgError: any) => {
					if (msgError.field !== '0') {
						newMessageError.push(msgError);
					}
				}),
			);
			messages = newMessageError;

			// for (let t = 0; t < errors.length; t++) {
			//   let arrayMessagesDTO: any[] = [];
			//   let field = errors[t].property;
			//   let messagesDTO = errors[t].constraints;

			//   // hanlde field parent
			//   for (let mess in messagesDTO) {
			//     const value = messagesDTO[mess];
			//     let handleMsg = value.split('|')[0];
			//     let [fileTranslate, msgTranslate] = handleMsg.split('.');
			//     codeMsg.push(msgTranslate);
			//     handleMsg = await i18n.t(
			//       `${fileTranslate}.${msgTranslate ? msgTranslate : ''}`,
			//     );
			//     arrayMessagesDTO.push(handleMsg);
			//   }

			//   let data = { field: field, msg: arrayMessagesDTO };
			//   messageError.push(data);

			//   // hanlde children field
			//   let childrenField = errors[t].children;

			//   // check field children
			//   if (childrenField.length > 0) {
			//     // check error of field children
			//     await Promise.all(
			//       childrenField.map(async (item: any) => {
			//         let dataChildren = await this.handleErrors(i18n, item);
			//         messageError.unshift(dataChildren);

			//         // hanlde children of children field
			//         let childrenOfChildrenField = item.children;
			//         if (childrenOfChildrenField.length > 0) {
			//           // check error of field children
			//           childrenOfChildrenField.map(async (item: any) => {
			//             let dataChildrenOfChildren = await this.handleErrors(
			//               i18n,
			//               item,
			//             );
			//             messageError.unshift(dataChildrenOfChildren);

			//             // hanlde children of children of children field
			//             let childrenOfChildrenOfChildrenField = item.children;

			//             if (childrenOfChildrenOfChildrenField.length > 0) {
			//               childrenOfChildrenOfChildrenField.map(async (item: any) => {
			//                 let dataChildrenOfChildrenOfChildrenField =
			//                   await this.handleErrors(i18n, item);
			//                 messageError.unshift(
			//                   dataChildrenOfChildrenOfChildrenField,
			//                 );
			//               });
			//             }
			//           });
			//         }
			//       }),
			//     );
			//   }
			// }
			// messages = messageError;
		} else {
			messages = responseBody?.message ? responseBody.message : responseBody;
			if (!Array.isArray(messages)) {
				if (messages?.toUpperCase() == messages) {
					codeMsg = messages;
					messages = await i18n.t(`languages.${messages}`);
				}
			}
		}

		let body: any;
		switch (status) {
			case 200:
			case 201:
				body = {
					errorCode: codeMsg,
					message: messages,
				};
				break;
			default:
				body = {
					message: Array.isArray(messages) ? messages : [messages],
					statusName: responseBody?.statusName || responseBody?.error || 'Error',
					statusCodeMsg: codeMsg,
					module: responseBody?.module || request?.route?.path,
					method: request.method || 'Unknown',
				};
				break;
		}

		// body = {
		//   message: Array.isArray(messages) ? messages : [messages],
		//   statusName: responseBody?.statusName || responseBody?.error || 'Error',
		//   statusCodeMsg: codeMsg,
		//   module: responseBody?.module || request?.route?.path,
		//   method: request.method || 'Unknown',
		// };

		response.status(status).json(body);
	}

	async handleErrors(i18n: any, item: any) {
		let codeMsg: any[] = [];
		let arrayMessagesDTO: any[] = [];
		let field = item.property;
		let messagesDTO = item.constraints;
		for (let mess in messagesDTO) {
			const value = messagesDTO[mess];
			let handleMsg = value.split('|')[0];
			let [fileTranslate, msgTranslate] = handleMsg.split('.');
			codeMsg.push(msgTranslate);
			handleMsg = await i18n.t(`${fileTranslate}.${msgTranslate ? msgTranslate : ''}`);
			arrayMessagesDTO.push(handleMsg);
		}

		let data = {
			field: field,
			msg: arrayMessagesDTO,
		};

		return data;
	}

	async checkChildrenField(i18n: any, children: any[], messageError: any[]): Promise<any[]> {
		await Promise.all(
			children.map(async (item: any) => {
				let data = await this.handleErrors(i18n, item);
				messageError.unshift(data);

				let childrenData = item.children;
				if (childrenData.length > 0) {
					messageError = await this.checkChildrenField(i18n, childrenData, messageError);
				}
			}),
		);

		return messageError;
	}
}
