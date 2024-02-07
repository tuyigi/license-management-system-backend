export class ResponseDataDto {
  data?: any | any[];
  status: number;
  message: string;
  timestamp: string;
  constructor(data?: any | any[], status?: number, message?: string) {
    this.data = data;
    this.status = status;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}
