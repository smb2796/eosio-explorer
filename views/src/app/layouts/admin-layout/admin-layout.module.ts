import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { BlockListComponent } from '../../block-list/block-list.component';
import { BlockDataComponent } from '../../dialogs/block-data/blockData.component';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatDialogModule
} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule
  ],
  declarations: [
    // DashboardComponent,
    BlockListComponent,
    BlockDataComponent
  ],
  entryComponents: [
    BlockDataComponent
  ],
})

export class AdminLayoutModule {}
