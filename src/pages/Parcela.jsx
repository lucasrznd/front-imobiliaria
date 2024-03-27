import React, { useRef, useState } from "react"
import { ParcelaModel } from "../models/ParcelaModel"
import MenuApp from "../components/Menu";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import Rodape from "../components/Rodape";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import { addLocale } from "primereact/api";

export default function CadastroParcela() {
    const [parcela, setParcela] = useState(new ParcelaModel());
    const [parcelas, setParcelas] = useState([
        { id: 1, contrato: 1, valorParcela: 500, dataInicio: '01/01/2024', dataVencimento: '31/01/2024', ativa: true }
    ]);
    const [detalhesVisible, setDetalhesVisible] = useState(false);
    const [buscarVisible, setBuscarVisible] = useState(false);
    const [deleteParcelaDialog, setDeleteParcelaDialog] = useState(false);
    const toast = useRef();

    addLocale('pt-BR', {
        firstDayOfWeek: 1,
        showMonthAfterYear: true,
        dayNames: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
        dayNamesShort: ['dom', 'seg', 'ter', 'quar', 'qui', 'sex', 'sab'],
        dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
        today: 'Hoje',
        clear: 'Limpar'
    });

    const conteudoInicial = (
        <React.Fragment>
            <Button icon="pi pi-plus-circle" label='Novo' onClick={novaParcelaAction} />
            <span style={{ margin: "10px" }} className="pi pi-ellipsis-v"></span>
            <Button icon="pi pi-search" label="Buscar" onClick={buscaParcelaAction} />
        </React.Fragment>
    );

    function novaParcelaAction() {
        setParcela(new ParcelaModel());
        setDetalhesVisible(true);
    }

    function buscaParcelaAction() {
        setParcela(new ParcelaModel());
        setBuscarVisible(true);
    }

    const acoesDataTable = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => detalhesParcela(rowData)} />
                <span style={{ margin: "15px" }} className="pi pi-ellipsis-v"></span>
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteParcela(rowData)} />
            </React.Fragment>
        );
    };

    const detalhesParcela = (parcela) => {
        setParcela({ ...parcela });
        setDetalhesVisible(true);
    }

    const fecharDetalhes = () => {
        setDetalhesVisible(false);
    }

    const fecharBusca = () => {
        setBuscarVisible(false);
    }

    const deletarParcela = () => {
        const novaLista = parcelas.filter(p => p.nome !== parcela.dataInicio);
        setParcelas(novaLista);
        setDeleteParcelaDialog(false);
        msgAviso('Parcela removida com sucesso.');
    }

    const confirmDeleteParcela = (parcela) => {
        setParcela({ ...parcela });
        setDeleteParcelaDialog(true);
    }

    const hideDeleteParcelaDialog = () => {
        setDeleteParcelaDialog(false);
    }

    const deleteParcelaDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDeleteParcelaDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deletarParcela} />
        </React.Fragment>
    );

    const salvarParcelaAction = () => {
        setDetalhesVisible(false);
        parcelas.push(parcela);
        msgSucesso('Parcela cadastrada com sucesso.');
    }

    const buscarParcelaAction = () => {
        console.log('Buscando parcela: ' + parcela.contrato);
        setBuscarVisible(false);
    }

    function msgSucesso(msg) {
        toast.current.show({ severity: 'success', summary: 'Sucesso', detail: msg, life: 3000 });
    }

    function msgAviso(msg) {
        toast.current.show({ severity: 'warn', summary: 'Aviso', detail: msg, life: 3000 });
    }

    function msgErro(msg) {
        toast.current.show({ severity: 'error', summary: 'Erro', detail: msg, life: 3000 });
    }

    function formatarStatus(rowData) {
        if (rowData && rowData.ativa) {
            if (rowData.ativa === true) {
                return 'Sim';
            }
        }
        return 'Não';
    }

    function formatarValor(rowData) {
        if (rowData && rowData.valorParcela) {
            return 'R$ ' + rowData.valorParcela + ',00';
        }
    }

    const rodapeModal = (
        <div>
            <Button label="Salvar" icon="pi pi-check" onClick={salvarParcelaAction} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharDetalhes} />
        </div>
    );

    const rodapeModalBuscar = (
        <div>
            <Button label="Buscar" icon="pi pi-check" onClick={buscarParcelaAction} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharBusca} />
        </div>
    )

    return (
        <div>
            <MenuApp />

            <div>
                <Toast ref={toast} />

                <Panel>
                    <Toolbar style={{ marginBottom: "10px" }} start={conteudoInicial} />

                    <div className="card">
                        <DataTable value={parcelas} tableStyle={{ minWidth: '50rem' }}
                            paginator header="Parcelas" rows={5} emptyMessage="Nenhuma parcela encontrada."
                            key="id">
                            <Column field="id" header="Código" align="center" alignHeader="center"></Column>
                            <Column field="contrato" header="Contrato" align="center" alignHeader="center"></Column>
                            <Column field="valorParcela" body={formatarValor} header="Valor Parcela" align="center" alignHeader="center"></Column>
                            <Column field="dataInicio" header="Data de Início" align="center" alignHeader="center"></Column>
                            <Column field="dataVencimento" header="Data de Vencimento" align="center" alignHeader="center"></Column>
                            <Column field="ativa" body={formatarStatus} header="Ativa" align="center" alignHeader="center" />
                            <Column body={acoesDataTable} exportable={false} style={{ minWidth: '12rem' }} align="center" header="Ações" alignHeader="center"></Column>
                        </DataTable>
                    </div>
                </Panel>

                <Dialog header="Detalhes da Parcela" visible={detalhesVisible} style={{ width: '30vw', minWidth: "30vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModal} draggable={false}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <label htmlFor='contrato' style={{ marginBottom: '0.5rem' }}>Contrato:</label>
                            <InputText id="contrato" value={parcela.contrato} onChange={(e) => setParcela({ ...parcela, contrato: e.target.value })} style={{ width: '300px' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <label htmlFor='valorParcela' style={{ marginBottom: '0.5rem' }}>Valor Parcela:</label>
                            <InputNumber id="valorParcela" value={parcela.valorParcela} onValueChange={(e) => setParcela({ ...parcela, valorParcela: e.target.value })} mode="currency" currency="BRL" locale="pt-BR" size={23} placeholder="R$ 2.000,00" />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <label htmlFor='dataInicio' style={{ marginBottom: '0.5rem' }}>Data de Início:</label>
                            <Calendar id="dataInicio" value={parcela.dataInicio} onChange={(e) => setParcela({ ...parcela, dataInicio: e.value })} style={{ width: '300px' }} showIcon dateFormat="dd/mm/yy" locale="pt-BR" />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <label htmlFor='dataVencimento' style={{ marginBottom: '0.5rem' }}>Data de Vencimento:</label>
                            <Calendar id="dataVencimento" value={parcela.dataVencimento} onChange={(e) => setParcela({ ...parcela, dataVencimento: e.value })} style={{ width: '300px' }} showIcon dateFormat="dd/mm/yy" />
                        </div>
                    </div>
                </Dialog>

                <Dialog header="Buscar Parcela" visible={buscarVisible} style={{ width: '30vw', minWidth: "30vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModalBuscar} draggable={false}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <label htmlFor="contrato" style={{ marginBottom: '0.5rem' }}>Contrato:</label>
                            <InputText id="contrato" value={parcela.contrato} onChange={(e) => setParcela({ ...parcela, contrato: e.target.value })} style={{ width: '300px' }} />
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={deleteParcelaDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmação" modal footer={deleteParcelaDialogFooter} onHide={hideDeleteParcelaDialog}>
                    <div className="confirmation-content" style={{ display: "flex", alignItems: "center" }}>
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {parcela && (
                            <span>
                                Deseja realmente excluir o registro?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Rodape />
            </div>
        </div>
    )
}