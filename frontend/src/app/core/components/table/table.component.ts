import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxChange, MatCheckboxModule } from "@angular/material/checkbox";
import { MatIcon } from "@angular/material/icon";
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { RouterModule } from "@angular/router";
import { Column } from "../../interfaces/models/table-column.model.interface";
import { CommonModule } from "@angular/common";
import moment from "moment";
import { SelectionModel } from "@angular/cdk/collections";

type CheckboxBodyEvent<T> = {
    checked: boolean;
    element: T
};

@Component({
    selector: 'app-table',
    standalone: true,
    imports: [
        MatTableModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIcon,
        MatPaginatorModule,
        RouterModule,
        CommonModule
    ],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss'
})
export class TableComponent<T> implements OnInit, AfterViewInit {

    @Input()
    tableColumns: Column[] = [];

    private _tableData: T[] = [];

    @Input()
    set tableData(value: T[]) {
        this._tableData = value;
        this.dataSource.data = this._tableData;
    }

    @Input()
    pageSize: number = 10;

    @Input()
    pageIndex: number = 0;

    @Input()
    totalRecords: number = 0;

    @Input()
    selection!: SelectionModel<T>;

    @Input()
    showEditActionButton = false;

    @Input()
    showInfoActionButton = false;

    @Input()
    actionsColumnHeaderLabel = '';

    @Output()
    pageChange = new EventEmitter<PageEvent>();

    @Output()
    headerCheckboxClicked = new EventEmitter<any>();

    @Output()
    bodyCheckboxClicked = new EventEmitter<CheckboxBodyEvent<T>>();

    @Output()
    editIconButtonClick = new EventEmitter<T>();

    @Output()
    infoIconButtonClick = new EventEmitter<T>();

    displayedColumns: Array<string> = [];
    dataSource: MatTableDataSource<T> = new MatTableDataSource<T>([]);

    momentJs = moment;
    selectedIds = new Set<number>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor() { }

    ngOnInit(): void {
        this.displayedColumns = this.tableColumns.map(col => col.columnDef);
    }

    ngAfterViewInit(): void {
        if (this.paginator) {
            this.paginator.length = this.totalRecords;
            this.paginator.pageIndex = this.pageIndex;
        }
        // this.selection.changed.subscribe(change => console.log('selection change', change));
    }

    onPageChange(event: PageEvent) {
        this.pageChange.emit(event);
    }

    isAllSelected() {
        return this.selection.selected.length === this.dataSource.data.length;
    }

    onHeaderCheckboxClick(event: MatCheckboxChange, col: any) {
        console.log(event);
        this.headerCheckboxClicked.emit(event);
    }

    onBodyCheckboxClick(event: MatCheckboxChange, element: T) {
        console.log(event);
        this.bodyCheckboxClicked.emit({ element, checked: event.checked });
    }

    onEditIconButtonClick(element: T) {
        this.editIconButtonClick.emit(element);
    }

    onInfoIconButtonClick(element: T) {
        this.infoIconButtonClick.emit(element);
    }
}


