import * as http from "http";

export const request = (options: any, tx?: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const req = http.request(options, (response) => {
            let data = '';
            response.on('data', (chunk) => data += chunk);
            response.on('end', () => resolve(data));
            response.on('error', (err) => reject(err));
        });
        req.on('error', (err) => reject(err));
        if (tx) {
            req.write(tx);
        }
        req.end();
    });
};

export default abstract class BaseClient {

    protected constructor(public readonly host: string, public readonly port: number) {
    }

    protected options(method: string, path: string) {
        return {
            host: this.host,
            port: this.port,
            method,
            path
        }
    }

}