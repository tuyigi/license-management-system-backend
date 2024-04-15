export class ResponseDataDto {
  data?: any | any[];
  status: number;
  message: string;
  timestamp: string;
  constructor(data?: any | any[], status?: number, message?: string) {
    this.data = data;
    this.status = status ? status : 200;
    this.message = message ? message : 'Success';
    this.timestamp = new Date().toISOString();
  }
}
