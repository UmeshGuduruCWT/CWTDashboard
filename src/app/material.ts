// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {MatButtonModule,MatMenuModule, MatCheckboxModule,MatToolbarModule,MatSidenavModule,MatStepperModule,
//   MatIconModule,MatListModule,MatInputModule,MatCardModule,MatTabsModule,MatSnackBarModule,
//   MatExpansionModule,MatFormFieldModule,MatDatepickerModule,MatNativeDateModule,MatSortModule,
//   MatButtonToggleModule,
//   MatRadioModule,MatSelectModule,MatPaginatorModule,MatTableModule, MatGridListModule,MatDialogModule,} from '@angular/material';
// import {FlexLayoutModule} from '@angular/flex-layout';
// import {LayoutModule} from '@angular/cdk/layout';
// import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
// import { SelectAutocompleteModule } from 'mat-select-autocomplete';
// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule, MatButtonModule, MatCheckboxModule,MatToolbarModule,MatSidenavModule,MatSortModule,
//     MatIconModule,MatListModule,MatInputModule,MatCardModule,MatTabsModule,MatSnackBarModule,MatButtonToggleModule,
//     MatExpansionModule,FlexLayoutModule,LayoutModule,MatFormFieldModule,MatDatepickerModule,MatDialogModule,
//     MatNativeDateModule,MatRadioModule,MatSelectModule,MatPaginatorModule,MatTableModule,MatStepperModule,
//     MatGridListModule,MatMenuModule,NgxMatSelectSearchModule,SelectAutocompleteModule
//   ],
//   exports:[ MatButtonModule, MatCheckboxModule,MatToolbarModule,MatSidenavModule,MatSortModule,
//     MatIconModule,MatListModule,MatInputModule,MatCardModule,MatTabsModule,MatSnackBarModule,MatButtonToggleModule,
//     MatExpansionModule,FlexLayoutModule,LayoutModule, MatFormFieldModule,MatDatepickerModule,MatDialogModule,
//     MatNativeDateModule,MatRadioModule,MatSelectModule,MatPaginatorModule,MatTableModule,MatStepperModule,
//     MatGridListModule,MatMenuModule,NgxMatSelectSearchModule,SelectAutocompleteModule]
// })
// export class MaterialModule { }
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatStepperModule} from '@angular/material/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule,} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
//import {MatMomentDateModule } from "@angular/material-moment-adapter";
import {MatSortModule} from '@angular/material/sort';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDialogModule} from '@angular/material/dialog';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LayoutModule} from '@angular/cdk/layout';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatBadgeModule} from '@angular/material/badge';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
@NgModule({
  declarations: [],
  imports: [
    CommonModule, MatButtonModule, MatCheckboxModule,MatToolbarModule,MatSidenavModule,MatSortModule,
    MatIconModule,MatListModule,MatInputModule,MatCardModule,MatTabsModule,MatSnackBarModule,MatNativeDateModule,
    MatExpansionModule,FlexLayoutModule,LayoutModule,MatFormFieldModule,MatDatepickerModule,MatDialogModule,
    MatRadioModule,MatSelectModule,MatPaginatorModule,MatTableModule,MatStepperModule,MatAutocompleteModule,
    MatGridListModule,MatMenuModule,MatTooltipModule,MatProgressBarModule,MatBadgeModule,MatProgressSpinnerModule,
    //MatNativeDateModule
  ],
  exports:[ MatButtonModule, MatCheckboxModule,MatToolbarModule,MatSidenavModule,MatSortModule,MatBadgeModule,
    MatIconModule,MatListModule,MatInputModule,MatCardModule,MatTabsModule,MatSnackBarModule,MatNativeDateModule,CdkTableModule,CdkTreeModule,
    MatExpansionModule,FlexLayoutModule,LayoutModule,MatFormFieldModule,MatDatepickerModule,MatDialogModule,MatProgressSpinnerModule,
    MatRadioModule,MatSelectModule,MatPaginatorModule,MatTableModule,MatStepperModule,MatAutocompleteModule,MatProgressBarModule,
    //MatNativeDateModule
    MatGridListModule,MatMenuModule,MatTooltipModule]
})
export class MaterialModule { }