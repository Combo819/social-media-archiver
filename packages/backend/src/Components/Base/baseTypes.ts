import { MangoQuery, MangoQuerySelector } from 'rxdb';

interface IBaseDAL<Info, Document> {
  findOneById(id: string): Promise<Document | null>;
  upsert(info: Info): Promise<Document>;
  count(selector: MangoQuerySelector): Promise<number>;
  query(queryObj: MangoQuery): Promise<Document[]>;
  remove(id: string): Promise<boolean>;
  bulkInsert(infos: Info[]): Promise<{ success: any[]; error: any[] }>;
  exportData(): Promise<Info[]>;
  getVersion(): number;
}

interface IBaseService<Info, Document, InfoPopulated> {
  startCrawling(id: string): void;
  save(info: Info): Promise<Document>;
  getOneByIdPopulated(id: string): Promise<InfoPopulated | null>;
  queryPopulated(queryObj: MangoQuery): Promise<InfoPopulated[]>;

  importData(
    filePath: string,
    version: number,
    batchSize: number,
  ): Promise<void>;
  exportData(): Promise<Info[]>;
  count(selector: MangoQuerySelector): Promise<number>;
  getVersion(): number;
}

interface IBaseCrawler {
  lazyInject: () => void;
  startCrawling: (id: string) => void;
}

export { IBaseDAL, IBaseService, IBaseCrawler };
