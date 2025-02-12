import { Column } from "../../../../../core/interfaces/models/table-column.model.interface";

export const TagsTableDefinition: Partial<Column>[] = [
    {
        columnDef: 'select',
        header: ' ',
        colType: 'checkbox',
        headerCheckbox: true
    },
    {
        columnDef: 'id',
        header: 'Id',
        colType: 'text'
    },
    {
        columnDef: 'name',
        header: 'Name',
        colType: 'text'
    },
    {
        columnDef: 'createdAt',
        header: 'Created At',
        colType: 'date'
    },
    {
        columnDef: 'updatedAt',
        header: 'Updated At',
        colType: 'date'
    },
    {
        columnDef: 'actions',
        header: 'Actions',
        colType: 'actions',
        actions: ["edit"]
    }
];