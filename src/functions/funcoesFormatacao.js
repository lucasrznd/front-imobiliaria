export function formatarData(rowData, columnName) {
    if (rowData && rowData[columnName]) {
        const data = new Date(rowData[columnName]);
        return data.toLocaleDateString('pt-BR');
    }
    return '';
}

export function formatarValorReal(data) {
    return 'R$' + data + ',00';
}

export function formatarValorRealDatatable(rowData, columnName) {
    if (rowData && rowData[columnName]) {
        return 'R$ ' + rowData[columnName] + ',00';
    }
}