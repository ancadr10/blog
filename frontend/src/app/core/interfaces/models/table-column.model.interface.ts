export interface Column {
    columnDef: string;     //data source key
    header: string;
    headerCheckbox?: boolean;
    colType: TemplateType;
    actions?: ActionType[]
}

type TemplateType = 'text' | 'date' | 'checkbox' | 'actions';
type ActionType = 'edit' | 'info';
