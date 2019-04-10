export class Item {
  constructor(
    public name: string,
    public price: number,
    public pictureUrl: string
  ) {}
}

export class CatalogData {
  constructor(
    public pageIndex: number,
    public pageSize: number,
    public count: number,
    public data: CatalogItem[]
  ) {}
}

export class CatalogItem {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public price: number,
    public PictureFileName: string,
    public pictureUri: string,
    public catalogTypeId: number,
    public catalogBrandId: number
  ) {}
}

export interface CatalogType {
  id: string;
  type: string;
}

export interface CatalogBrand {
  id: string;
  brand: string;
}

export interface Image {
  name: string;
  path: string;
  filePath: string;
  blob?: Blob;
}