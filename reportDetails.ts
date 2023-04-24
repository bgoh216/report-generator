export type ReportDetails = {
  filename: string;
  directory?: string;
  format: string;
  result: any;
};

export type ReportGeneratorMap = {
    [generator: string]: (reportDetails: ReportDetails) => Promise<string>
};

export type CSV = any[];
