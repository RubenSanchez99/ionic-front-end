import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { CatalogItem, CatalogType, CatalogBrand, CatalogData } from "./types";
import { throwError as ObservableThrowError, Observable } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class CatalogService {
  header = new HttpHeaders().set("Content-type", "application/json");

  constructor(private http: HttpClient) {}

  getCatalogItem(Id: string): Observable<CatalogItem> {
    return this.http
      .get<CatalogItem>(`http://10.0.2.2:5101/api/v1/catalog/items/${Id}`)
      .pipe(catchError(error => this._handleError(error)));
  }

  addProduct(
    product: CatalogItem,
    file: Blob,
    fileName: string
  ): Observable<any> {
    console.log(JSON.stringify(product));
    const formData: FormData = new FormData();
    product.PictureFileName = fileName;
    for ( const key in product ) {
      formData.append(key, product[key]);
    }
    console.log(JSON.stringify(product));
    formData.append("file", file, fileName);

    return this.http
      .post("http://10.0.2.2:5101/api/v1/catalog/items", formData)
      .pipe(catchError(error => this._handleError(error)));
  }

  updateProduct(product: CatalogItem): Observable<any> {
    return this.http
      .put(
        `http://10.0.2.2:5101/api/v1/catalog/items`,
        JSON.stringify(product),
        { headers: this.header }
      )
      .pipe(catchError(error => this._handleError(error)));
  }

  getCatalogTypes(): Observable<CatalogType[]> {
    return this.http
      .get<CatalogType[]>("http://10.0.2.2:5101/api/v1/catalog/CatalogTypes")
      .pipe(catchError(error => this._handleError(error)));
  }

  getCatalogBrands(): Observable<CatalogBrand[]> {
    return this.http
      .get<CatalogBrand[]>("http://10.0.2.2:5101/api/v1/catalog/CatalogBrands")
      .pipe(catchError(error => this._handleError(error)));
  }

  getCatalogItems(): Observable<CatalogData> {
    return this.http
      .get<CatalogData>("http://10.0.2.2:5101/api/v1/catalog/items")
      .pipe(catchError(error => this._handleError(error)));
  }

  private _handleError(err: HttpErrorResponse | any): Observable<any> {
    const errorMsg = err.message || "Error: Unable to complete request.";
    return ObservableThrowError(errorMsg);
  }
}
