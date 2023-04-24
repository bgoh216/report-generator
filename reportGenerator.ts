import fs from 'fs';
import path from 'path';
import * as csvwriter from 'csv-writer';
import { logger } from '../utils/logger';
import { CSV, ReportDetails, ReportGeneratorMap } from './reportDetails';

export class ReportGenerator {
    filepath: string;

    readonly reportGeneratorMap: ReportGeneratorMap = {
        csv: this.generateCsvReport,
        html: this.generateHtmlReport,
        json: this.generateJsonReport,
        pdf: this.generatePdfReport,
        text: this.generateTextReport
    };

    async generate(reportDetails: ReportDetails): Promise<string> {
        if (reportDetails.directory) {
            this.createDirectory(reportDetails.directory);
        }
        
        logger.info(`Received ${reportDetails.filename} report with format ${reportDetails.format}`);
        const ext: string = (reportDetails.format).split("/")[1];

        this.createFilePath(reportDetails);
        return await this.reportGeneratorMap[ext](reportDetails);
    }

    private async generateHtmlReport(reportDetails: ReportDetails): Promise<string> {
        try {
            logger.info(`Generating ${this.filepath} report...`);

            const data = JSON.stringify(reportDetails.result);

            fs.writeFileSync(this.filepath, data);
            logger.info(`Results successfully written into ${this.filepath}.`);

            return this.filepath;
        } catch (error: any) {
            logger.error(error);
            throw new Error(error);
        }
    }

    private async generateCsvReport(reportDetails: ReportDetails): Promise<string> {
        try {
            logger.info(`Generating ${this.filepath} report...`);

            const data: CSV = reportDetails.result as CSV;

            if (data.length == 0) {
                fs.writeFileSync(this.filepath, 'No Results Found');
            } else {
                const createCsvWriter = csvwriter.createObjectCsvWriter;
                const header = Object.keys(data[0]).map(k => {
                    return { id: k, title: k };
                })
                const csvWriter = createCsvWriter({
                    path: this.filepath,
                    header: header
                });

                logger.info(`Results successfully written into ${this.filepath}.`);
                await csvWriter.writeRecords(data);
            }
            return this.filepath;
        } catch (error: any) {
            logger.error(error);
            throw new Error(error);
        }
    }

    private async generateJsonReport(reportDetails: ReportDetails): Promise<string> {
        try {
            logger.info(`Generating ${this.filepath} report...`);

            const data: string = JSON.stringify(reportDetails.result ? reportDetails.result : null);

            fs.writeFileSync(this.filepath, data);
            logger.info(`Results successfully written into ${this.filepath}.`);
            
            return this.filepath;
        } catch (error: any) {
            logger.error(error);
            throw new Error(error);
        }
    }

    private async generatePdfReport(reportDetails: ReportDetails): Promise<string> {
        try {
            logger.info(`Generating ${this.filepath} report...`);

            const data = JSON.stringify(reportDetails.result);

            fs.writeFileSync(this.filepath, data);
            logger.info(`Results successfully written into ${this.filepath}.`);
            
            return this.filepath;
        } catch (error: any) {
            logger.error(error);
            throw new Error(error);
        }
    }

    private async generateTextReport(reportDetails: ReportDetails): Promise<string> {
        try {
            logger.info(`Generating ${this.filepath} report...`);

            const data = JSON.stringify(reportDetails.result);

            fs.writeFileSync(this.filepath, data);
            logger.info(`Results successfully written into ${this.filepath}.`);
            
            return this.filepath;
        } catch (error: any) {
            logger.error(error);
            throw new Error(error);
        }
    }

    private createDirectory(directory: string) {
        fs.mkdir(
            path.join(`${__dirname}/${directory}`),
            { recursive: true },
            (err) => {
                if (err) throw err;
            }
        );
    }

    private createFilePath(reportDetails: ReportDetails) {
        let filepath: string = reportDetails.directory
            ? path.join(`${reportDetails.directory}/${reportDetails.filename}`)
            : `${reportDetails.filename}`;
        this.filepath = path.join(`${__dirname}/${filepath}`);
    }
}
