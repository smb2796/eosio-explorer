import { Routes } from '@angular/router';

import { BlockListComponent } from '../../block-list/block-list.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'block-list',     component: BlockListComponent },
];
