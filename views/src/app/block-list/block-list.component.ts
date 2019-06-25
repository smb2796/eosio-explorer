import { Component, OnInit } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockDataComponent } from '../dialogs/block-data/blockData.component';

@Component({
  selector: 'app-block-list',
  templateUrl: './block-list.component.html',
  styleUrls: ['./block-list.component.css']
})
export class BlockListComponent implements OnInit {

  blocks:any;

  constructor(protected crudService: CrudService, 
    public dialog: MatDialog) { }

  ngOnInit() {

  }

  loadBlocks(){
    //Call crud service to load blocks
    this.crudService.getBlocks().then(blockList => {
      //set block list equal to return
      this.displayBlocks(blockList);
    });
    
  }

  //set block list equal to return of crud service api call
  //fill table with 10 most recent blocks
  displayBlocks(blockList){
    this.blocks = blockList;
  }

  //open block dialog to show block raw data
  //pass block to dialog so that it knows which block to reference
  showBlockInfo(block){
    this.dialog.open( BlockDataComponent, {
      width: '60%',
      data: {
        "title": "block data",
        "block": block
      } 
    } );
  }

}
