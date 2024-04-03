import React, { useRef, useState } from "react"
import { ContratoModel } from "../models/ContratoModel"
import { Button } from "primereact/button";
import MenuApp from "../components/Menu";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Toolbar } from "primereact/toolbar";
import { Column } from "primereact/column";
import Rodape from "../components/Rodape";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { AutoComplete } from "primereact/autocomplete";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from 'primereact/calendar';
import 'primeicons/primeicons.css';

export default function CadastroContrato() {
    const [contrato, setContrato] = useState(new ContratoModel());
    const [contratos, setContratos] = useState([
        {
            id: 1, imovel: "Casa", locatario: 'Exemplo', dataInicio: '01/05/2004', dataTermino: "31/05/2004", valorMensal: 300, multa: 150, ativo: true
        }
    ]);
    const [detalhesVisible, setDetalhesVisible] = useState(false);
    const [buscarVisible, setBuscarVisible] = useState(false);
    const [deleteContratoDialog, setDeleteContratoDialog] = useState(false);
    const [items, setItems] = useState([]);
    const toast = useRef();

    const buscaAutocomplete = (event) => {
        setItems([...Array(10).keys()].map(item => event.query + '-' + item));
    }

    const conteudoInicial = (
        <React.Fragment>
            <Button icon="pi pi-plus-circle" label='Novo' onClick={novoContratoAction} />
            <span style={{ margin: "10px" }} className="pi pi-ellipsis-v"></span>
            <Button icon="pi pi-search" label="Buscar" onClick={buscaContratoAction} />
            <span style={{ margin: "10px" }} className="pi pi-ellipsis-v"></span>
            <Button icon="pi pi-credit-card" label="Parcelas" onClick={buscaContratoAction} />
        </React.Fragment>
    );

    function novoContratoAction() {
        setContrato(new ContratoModel());
        setDetalhesVisible(true);
    }

    function buscaContratoAction() {
        setContrato(new ContratoModel());
        setBuscarVisible(true);
    }

    const acoesDataTable = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => detalhesContrato(rowData)} />
                <span style={{ margin: "15px" }} className="pi pi-ellipsis-v"></span>
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteContrato(rowData)} />
            </React.Fragment>
        );
    };

    const detalhesContrato = (contrato) => {
        setContrato({ ...contrato });
        setDetalhesVisible(true);
    }

    const fecharDetalhes = () => {
        setDetalhesVisible(false);
    }

    const fecharBusca = () => {
        setBuscarVisible(false);
    }

    const deletarContrato = () => {
        const novaLista = contratos.filter(c => c.imovel !== contrato.imovel);
        setContratos(novaLista);
        setDeleteContratoDialog(false);
        msgAviso('Contrato removido com sucesso.');
    }

    const confirmDeleteContrato = (contrato) => {
        setContrato({ ...contrato });
        setDeleteContratoDialog(true);
    }

    const hideDeleteContratoDialog = () => {
        setDeleteContratoDialog(false);
    }

    const deleteContratoDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDeleteContratoDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deletarContrato} />
        </React.Fragment>
    );

    const salvarContratoAction = () => {
        setDetalhesVisible(false);
        console.log(contrato);
        contratos.push(contrato);
        msgSucesso('Imóvel cadastrado com sucesso.');
    }

    const buscarContratoAction = () => {
        console.log('Buscando imóvel: ' + contrato.titulo);
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

    const rodapeModal = (
        <div>
            <Button label="Salvar" icon="pi pi-check" onClick={salvarContratoAction} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharDetalhes} />
        </div>
    );

    const rodapeModalBuscar = (
        <div>
            <Button label="Buscar" icon="pi pi-check" onClick={buscarContratoAction} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharBusca} />
        </div>
    );

    function formatarStatus(rowData) {
        if (rowData && rowData.ativo) {
            if (rowData.ativo === true) {
                return 'Sim';
            }
        }
        return 'Não';
    }

    return (
        <div>
            <MenuApp />

            <div>
                <Toast ref={toast} />

                <Panel>
                    <Toolbar style={{ marginBottom: "10px" }} start={conteudoInicial} />

                    <div className="card">
                        <DataTable value={contratos} tableStyle={{ minWidth: '50rem' }}
                            paginator header="Contratos" rows={5} emptyMessage="Nenhum contrato encontrado."
                            key="id">
                            <Column field="id" header="Código" align="center" alignHeader="center"></Column>
                            <Column field="imovel" header="Imóvel" align="center" alignHeader="center"></Column>
                            <Column field="locatario" header="Locatário" align="center" alignHeader="center" />
                            <Column field="dataInicio" header="Data de Início" align="center" alignHeader="center" />
                            <Column field="dataTermino" header="Data de Término" align="center" alignHeader="center" />
                            <Column field="valorMensal" header="Valor Mensal" align="center" alignHeader="center" />
                            <Column field="multa" header="Multa" align="center" alignHeader="center" />
                            <Column field="ativo" header="Ativo" body={formatarStatus} align="center" alignHeader="center" />
                            <Column body={acoesDataTable} exportable={false} style={{ minWidth: '12rem' }} align="center" header="Ações" alignHeader="center" />
                        </DataTable>
                    </div>
                </Panel>

                <Dialog header="Detalhes do Contrato" visible={detalhesVisible} style={{ width: '45vw', minWidth: "40vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModal} draggable={false}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '1rem', flex: 1 }}>
                                <label htmlFor='imovel' style={{ marginBottom: '0.5rem' }}>Imóvel:</label>
                                <AutoComplete id="imovel" value={contrato.imovel} suggestions={items} completeMethod={buscaAutocomplete} onChange={(e) => setContrato({ ...contrato, imovel: e.target.value })} style={{ width: '100%' }} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <label htmlFor='locatario' style={{ marginBottom: '0.5rem' }}>Locatário:</label>
                                <AutoComplete value={contrato.locatario} suggestions={items} completeMethod={buscaAutocomplete} onChange={(e) => setContrato({ ...contrato, locatario: e.target.value })} style={{ width: '100%' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '1rem', flex: 1 }}>
                                <label htmlFor='dataInicio' style={{ marginBottom: '0.5rem' }}>Data de Ínicio:</label>
                                <Calendar inputId="dataInicio" value={contrato.dataInicio} onValueChange={(e) => setContrato({ ...contrato, dataInicio: e.target.value })} style={{ width: '100%' }} dateFormat="dd/mm/yy" />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <label htmlFor='dataTermino' style={{ marginBottom: '0.5rem' }}>Data de Término:</label>
                                <Calendar id="dataTermino" value={contrato.dataTermino} onValueChange={(e) => setContrato({ ...contrato, dataTermino: e.target.value })} style={{ width: '100%' }} dateFormat="dd/mm/yy" />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <label htmlFor='valorMensal' style={{ marginBottom: '0.5rem' }}>Valor Mensal:</label>
                                <InputNumber id="valorMensal" value={contrato.valorMensal} onValueChange={(e) => setContrato({ ...contrato, valorMensal: e.target.value })} mode="currency" currency="BRL" locale="pt-BR" style={{ width: "100%" }} placeholder="R$500" />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '1rem', flex: 1 }}>
                                <label htmlFor='multa' style={{ marginBottom: '0.5rem' }}>Multa:</label>
                                <InputNumber id="multa" value={contrato.multa} onValueChange={(e) => setContrato({ ...contrato, multa: e.target.value })} mode="currency" currency="BRL" locale="pt-BR" style={{ width: "100%" }} placeholder="R$1000" />
                            </div>
                        </div>
                    </div>
                </Dialog>

                <Dialog header="Buscar Contrato" visible={buscarVisible} style={{ width: '30vw', minWidth: "30vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModalBuscar} draggable={false}>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <label htmlFor='Contrato' style={{ marginBottom: '0.5rem' }}>Imóvel:</label>
                            <AutoComplete id="Contrato" value={contrato.imovel} suggestions={items} completeMethod={buscaAutocomplete} onChange={(e) => setContrato({ ...contrato, imovel: e.target.value })} style={{ width: '100%' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <label htmlFor='locatario' style={{ marginBottom: '0.5rem' }}>Locatário:</label>
                            <AutoComplete value={contrato.locatario} suggestions={items} completeMethod={buscaAutocomplete} onChange={(e) => setContrato({ ...contrato, locatario: e.target.value })} style={{ width: '100%' }} />
                        </div>
                    </div>

                </Dialog>

                <Dialog visible={deleteContratoDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmação" modal footer={deleteContratoDialogFooter} onHide={hideDeleteContratoDialog}>
                    <div className="confirmation-content" style={{ display: "flex", alignItems: "center" }}>
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {contrato && (
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