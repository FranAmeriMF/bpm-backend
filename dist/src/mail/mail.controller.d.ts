import { MailService } from './mail.service';
declare class TestMailDto {
    to: string;
}
export declare class MailController {
    private readonly mail;
    constructor(mail: MailService);
    test(dto: TestMailDto): Promise<{
        mensaje: string;
    }>;
}
export {};
