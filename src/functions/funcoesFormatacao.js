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
    const valor = rowData && rowData[columnName];

    // Se o valor for null, undefined ou 0, exibe 'R$ 0,00'
    if (valor === null || valor === undefined || valor === 0) {
        return 'R$ 0,00';
    }

    // Caso contrário, formata o valor como uma moeda
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

export function formatarStatusAtivo(rowData, columnName) {
    if (rowData && rowData[columnName]) {
        if (rowData[columnName] === true) {
            return 'Sim';
        }
    }
    return 'Não';
}