import { Component, OnInit, Inject,  Output, EventEmitter, assertPlatform } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { CrudService } from '../../services/crud.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component( {
  selector: 'block-data-dialog',
  templateUrl: './blockData.component.html',
  styleUrls: ['./blockData.component.css'],
} )
export class BlockDataComponent implements OnInit {

  displayedBlockData:any;
  contractData:any;
  viewData = true;

  @Output() cancelEvent = new EventEmitter<string>();

  constructor(protected crudService: CrudService,
            public dialogRef: MatDialogRef<BlockDataComponent>,
            @Inject( MAT_DIALOG_DATA ) public data: any
              ) {
  }

  ngOnInit() {
      this.displayedBlockData = this.data.block;
      this.loadContracts();
  }

  close() {
    this.dialogRef.close();
  }

  //load ricardian contracts for the block that was selected
  loadContracts() {
    let contractRequestParams = [];
    //in the clicked block, for each transaction check to see if trx is an object or a hash, if object then continue
    for (let i = 0; i < this.displayedBlockData.transactions.length; i++){
        if(typeof this.displayedBlockData.transactions[i].trx == "object"){
            //if block has actions
            if(this.displayedBlockData.transactions[i].trx.transaction.actions){
                //for each action in this transaction
                for(let j = 0; j < this.displayedBlockData.transactions[i].trx.transaction.actions.length; j++){
                    //create object with account name and type of action so that we can push an array of this to our crud service call to get all ricardian contracts
                    let accountTypePair = {
                        "account": this.displayedBlockData.transactions[i].trx.transaction.actions[j].account,
                        "type": this.displayedBlockData.transactions[i].trx.transaction.actions[j].name
                    }
                    contractRequestParams.push(accountTypePair);
                }
            }
        }
        
    }
    var data = {
        "pairingList": contractRequestParams
    }
    // get all ricardian contracts for a block
    this.crudService.getContractList(data).then(contractList => {
        this.contractData = contractList;
    });
    
  }

  //toggle between displaying data and displaying contracts
  displayData(){
    this.viewData = true;
  }
  displayContracts(){
      this.viewData = false;
  }


}