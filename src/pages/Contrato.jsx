import React, { useEffect, useRef, useState } from "react"
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
import { AutoComplete } from "primereact/autocomplete";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from 'primereact/calendar';
import 'primeicons/primeicons.css';
import { ContratoService } from "../services/ContratoService";
import { LocatarioService } from "../services/LocatarioService";
import { ImovelService } from "../services/ImovelService";
import { InputText } from "primereact/inputtext";
import { formatarStatusAtivo } from "../functions/funcoesFormatacao";
import { formatarData } from "../functions/funcoesFormatacao";
import { formatarValorRealDatatable } from "../functions/funcoesFormatacao";
import { Checkbox } from "primereact/checkbox";

export default function CadastroContrato() {
    const [contrato, setContrato] = useState(new ContratoModel());
    const [contratos, setContratos] = useState([]);
    const contratoService = new ContratoService();

    const [imoveis, setImoveis] = useState([]);
    const [imoveisFiltrados, setImoveisFiltrados] = useState([]);
    const imovelService = new ImovelService();

    const [locatarios, setLocatarios] = useState([]);
    const [locatariosFiltrados, setLocatariosFiltrados] = useState([]);
    const locatarioService = new LocatarioService();

    const [detalhesVisible, setDetalhesVisible] = useState(false);
    const [buscarVisible, setBuscarVisible] = useState(false);
    const [deleteContratoDialog, setDeleteContratoDialog] = useState(false);
    const toast = useRef();

    const conteudoInicial = (
        <React.Fragment>
            <Button icon="pi pi-plus-circle" label='Novo' onClick={novoContratoAction} />
            <span style={{ margin: "10px" }} className="pi pi-ellipsis-v"></span>
            <Button icon="pi pi-search" label="Buscar" onClick={buscaContratoAction} />
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
                <span style={{ marginLeft: "3px" }} className="pi pi-ellipsis-v"></span>
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

    const deletarContrato = async () => {
        setDeleteContratoDialog(false);
        await excluirContrato();
        await listarContratos();
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

    const salvarContratoAction = async () => {
        await salvarContrato();
        setDetalhesVisible(false);
        msgSucesso('Contrato cadastrado com sucesso.');
    }

    const buscarContratoAction = async () => {
        await buscarContratoPorId();
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

    const listarImoveis = async () => {
        try {
            const response = await imovelService.listarTodos();
            setImoveis(response.data);
        } catch (error) {
            msgErro('Erro ao carregar imóveis.');
        }
    }

    const completeMethodImoveis = (ev) => {
        const sugestoesFiltradas = imoveis.filter(i => i.titulo.toLowerCase().includes(ev.query.toLowerCase()));

        setImoveisFiltrados(sugestoesFiltradas);

        return sugestoesFiltradas;
    };

    const listarLocatarios = async () => {
        try {
            const response = await locatarioService.listarTodos();
            setLocatarios(response.data);
        } catch (error) {
            msgErro('Erro ao carregar locatários.');
        }
    }

    const completeMethodLocatarios = (ev) => {
        const sugestoesFiltradas = locatarios.filter(l => l.nome.toLowerCase().includes(ev.query.toLowerCase()));

        setLocatariosFiltrados(sugestoesFiltradas);

        return sugestoesFiltradas;
    };

    const listarContratos = async () => {
        try {
            const response = await contratoService.listarTodos();
            setContratos(response.data);
        } catch (error) {
            msgErro('Erro ao carregar contratos.');
        }
    }

    const buscarContratoPorId = async () => {
        try {
            const response = await contratoService.buscarPorId(contrato.id);
            setContratos([response.data]);
            setContrato(new ContratoModel());
        } catch (error) {
            if (error.request.status === 404) {
                msgAviso('Código inexistente.');
                return;
            }
            msgErro('Erro ao buscar imóvel.');
        }
    }

    const salvarContrato = async () => {
        if (contrato.id === undefined) {
            if(contrato.multa == null) contrato.multa = 0;
            await contratoService.salvar(contrato);
            await listarContratos();
            setContrato(new ContratoModel());
        } else {
            await contratoService.editar(contrato);
            await listarContratos();
            setContrato(new ContratoModel());
        }
    }

    const excluirContrato = async () => {
        await contratoService.excluir(contrato.id);
        msgAviso('Contrato removido com sucesso.');
    }

    useEffect(() => {
        listarContratos();
        listarImoveis();
        listarLocatarios();
        // eslint-disable-next-line
    }, []);

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
                            <Column field="imovel.titulo" header="Imóvel" align="center" alignHeader="center"></Column>
                            <Column field="locatario.nome" header="Locatário" align="center" alignHeader="center" />
                            <Column field="dataInicio" header="Data de Início" body={(rowData) => formatarData(rowData, "dataInicio")} align="center" alignHeader="center" />
                            <Column field="dataTermino" header="Data de Término" body={(rowData) => formatarData(rowData, "dataFim")} align="center" alignHeader="center" />
                            <Column field="valorMensal" header="Valor Mensal" body={(rowData) => formatarValorRealDatatable(rowData, "valorMensal")} align="center" alignHeader="center" />
                            <Column field="multa" header="Multa" body={(rowData) => formatarValorRealDatatable(rowData, "multa")} align="center" alignHeader="center" />
                            <Column field="status" header="Ativo" body={(rowData) => formatarStatusAtivo(rowData, "status")} align="center" alignHeader="center" />
                            <Column body={acoesDataTable} exportable={false} style={{ minWidth: '12rem' }} align="center" header="Ações" alignHeader="center" />
                        </DataTable>
                    </div>
                </Panel>

                <Dialog header="Detalhes do Contrato" visible={detalhesVisible} style={{ width: '45vw', minWidth: "40vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModal} draggable={false}>
                    <div className="card p-fluid">
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor='imovel' style={{ marginBottom: '0.5rem' }}>Imóvel:</label>
                                <AutoComplete id="imovel" value={contrato.imovel} suggestions={imoveisFiltrados} field="titulo" completeMethod={completeMethodImoveis} onChange={(e) => setContrato({ ...contrato, imovel: e.target.value })} />
                            </div>
                            <div className="field col">
                                <label htmlFor='locatario' style={{ marginBottom: '0.5rem' }}>Locatário:</label>
                                <AutoComplete value={contrato.locatario} suggestions={locatariosFiltrados} field="nome" completeMethod={completeMethodLocatarios} onChange={(e) => setContrato({ ...contrato, locatario: e.target.value })} />
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor='dataInicio' style={{ marginBottom: '0.5rem' }}>Data de Ínicio:</label>
                                <Calendar inputId="dataInicio" value={new Date(contrato?.dataInicio)} onChange={(e) => setContrato({ ...contrato, dataInicio: e.value })} showIcon dateFormat="dd/mm/yy" />
                            </div>
                            <div className="field col">
                                <label htmlFor='dataFim' style={{ marginBottom: '0.5rem' }}>Data de Término:</label>
                                <Calendar id="dataFim" value={new Date(contrato?.dataFim)} onChange={(e) => setContrato({ ...contrato, dataFim: e.value })} showIcon dateFormat="dd/mm/yy" />
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor='valorMensal' style={{ marginBottom: '0.5rem' }}>Valor Mensal:</label>
                                <InputNumber id="valorMensal" value={contrato.valorMensal} onChange={(e) => setContrato({ ...contrato, valorMensal: e.value }) } mode="currency" currency="BRL" locale="pt-BR" placeholder="R$ 0,00" />
                            </div>
                            <div className="field col">
                                <label htmlFor='multa' style={{ marginBottom: '0.5rem' }}>Multa:</label>
                                <InputNumber id="multa" value={contrato.multa} onChange={(e) => setContrato({ ...contrato, multa: e.value })} mode="currency" currency="BRL" locale="pt-BR" placeholder="R$ 0,00" />
                            </div>
                        </div>
                        <div className="field">
                            <div className="flex align-items-center justify-content-center">
                                <label htmlFor='status'>Ativo:</label>
                                <Checkbox id="status" onChange={(e) => setContrato({ ...contrato, status: e.checked })} checked={contrato.status} className="ml-1" />
                            </div>
                        </div>
                    </div>
                </Dialog>

                <Dialog header="Buscar Contrato" visible={buscarVisible} style={{ width: '30vw', minWidth: "30vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModalBuscar} draggable={false}>
                    <div className="card p-fluid">
                        <div className="field">
                            <label htmlFor='id' style={{ marginBottom: '0.5rem' }}>Código:</label>
                            <InputText id="id" value={contrato.id} onChange={(e) => setContrato({ ...contrato, id: e.target.value })} placeholder="Ex: 2a78" />
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