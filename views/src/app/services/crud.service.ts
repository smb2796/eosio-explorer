import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class CrudService {

  constructor(private http: HttpClient,
              private spinner: NgxSpinnerService) {
  }

  getBaseUrl(urlType) {
    if (urlType === 'api') {
      return 'http://localhost:3000/';
    }
  }

  blocks:any;
  async getBlocks() {
    if(!this.blocks){ //null case
      return this._getBlocks();
    }
    return await this.blocks;
  }

  async _getBlocks() {
    this.spinner.show();
    return await this.http.get( this.getBaseUrl( 'api' ) + 'explorer/getBlocks')
      .toPromise()
      .then( (res: any) => {
        this.spinner.hide();
        return res;
      } ).catch( err => {
        console.error( err );
        this.spinner.hide();
      } );
  }

  contracts:any;
  async getContractList(data) {
    if(!this.blocks){ //null case
      return this._getContractList(data);
    }
    return await this.contracts;
  }

  async _getContractList(data) {
    this.spinner.show();
    return await this.http.post( this.getBaseUrl( 'api' ) + 'explorer/getContractList', data)
      .toPromise()
      .then( (res: any) => {
        this.spinner.hide();
        return res;
      } ).catch( err => {
        console.error( err );
        this.spinner.hide();
      } );
  }

}