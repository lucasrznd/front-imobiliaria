export function msgSucesso(toast, msg) {
    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: msg, life: 4000 });
}

export function msgAviso(toast, msg) {
    toast.current.show({ severity: 'warn', summary: 'Aviso', detail: msg, life: 4000 });
}

export function msgErro(toast, msg) {
    toast.current.show({ severity: 'error', summary: 'Erro', detail: msg, life: 4000 });
}