import MenuApp from "../components/Menu";
import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import { Toolbar } from 'primereact/toolbar';
import { InputMask } from 'primereact/inputmask';
import Rodape from "../components/Rodape";
import { LocatarioModel } from "../models/LocatarioModel";
import { LocatarioService } from "../services/LocatarioService";

export default function CadastroLocatario() {
    const [locatario, setLocatario] = useState(new LocatarioModel());
    const [locatarios, setLocatarios] = useState([]);
    const locatarioService = new LocatarioService();

    const [detalhesVisible, setDetalhesVisible] = useState(false);
    const [buscarVisible, setBuscarVisible] = useState(false);
    const [deleteLocatarioDialog, setDeleteLocatarioDialog] = useState(false);
    const toast = useRef();

    const conteudoInicial = (
        <React.Fragment>
            <Button icon="pi pi-plus-circle" label='Novo' onClick={novoLocatarioAction} />
            <span style={{ margin: "10px" }} className="pi pi-ellipsis-v"></span>
            <Button icon="pi pi-search" label="Buscar" onClick={buscaLocatarioAction} />
        </React.Fragment>
    );

    function novoLocatarioAction() {
        setLocatario(new LocatarioModel());
        setDetalhesVisible(true);
    }

    function buscaLocatarioAction() {
        setLocatario(new LocatarioModel());
        setBuscarVisible(true);
    }

    const acoesDataTable = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => detalhesLocatario(rowData)} />
                <span style={{ margin: "15px" }} className="pi pi-ellipsis-v"></span>
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteLocatario(rowData)} />
            </React.Fragment>
        );
    };

    const detalhesLocatario = (locatario) => {
        setLocatario({ ...locatario });
        setDetalhesVisible(true);
    };

    const fecharDetalhes = () => {
        setDetalhesVisible(false);
    }

    const fecharBusca = () => {
        setBuscarVisible(false);
    }

    const deletarLocatario = async () => {
        setDeleteLocatarioDialog(false);
        await excluirLocatario();
        await listarLocatarios();
    }

    const confirmDeleteLocatario = (locatario) => {
        setLocatario({ ...locatario });
        setDeleteLocatarioDialog(true);
    };

    const hideDeleteLocatarioDialog = () => {
        setDeleteLocatarioDialog(false);
    };

    const deleteLocatarioDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDeleteLocatarioDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deletarLocatario} />
        </React.Fragment>
    );

    const salvarLocatarioAction = () => {
        setDetalhesVisible(false);
        salvarLocatario();
        msgSucesso('Locatário salvo com sucesso.');
    }

    const buscarLocatarioAction = async () => {
        await buscarLocatarioPorId();
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
            <Button label="Salvar" icon="pi pi-check" onClick={salvarLocatarioAction} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharDetalhes} />
        </div>
    );

    const rodapeModalBuscar = (
        <div>
            <Button label="Buscar" icon="pi pi-check" onClick={buscarLocatarioAction} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharBusca} />
        </div>
    );

    const listarLocatarios = async () => {
        try {
            const response = await locatarioService.listarTodos();
            setLocatarios(response.data);
        } catch (error) {
            msgErro('Erro ao carregar locatários.');
        }
    }

    const buscarLocatarioPorId = async () => {
        try {
            const response = await locatarioService.buscarPorId(locatario.id);
            setLocatarios([response.data]);
            setLocatario(new LocatarioModel());
        } catch (error) {
            msgErro('Erro ao buscar locatário.');
        }
    }

    const salvarLocatario = async () => {
        if (locatario.id === undefined) {
            await locatarioService.salvar(locatario);
            await listarLocatarios();
            setLocatario(new LocatarioModel());
        } else {
            await locatarioService.editar(locatario);
            await listarLocatarios();
            setLocatario(new LocatarioModel());
        }
    }

    const excluirLocatario = async () => {
        await locatarioService.excluir(locatario.id);
        msgAviso('Locatário removido com sucesso.');
    }

    useEffect(() => {
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
                        <DataTable value={locatarios} tableStyle={{ minWidth: '50rem' }}
                            paginator header="Locatários" rows={5} emptyMessage="Nenhum locatário encontrado."
                            key="id">
                            <Column field="id" header="Código" align="center" alignHeader="center"></Column>
                            <Column field="nome" header="Nome" align="center" alignHeader="center"></Column>
                            <Column field="telefone" header="Telefone" align="center" alignHeader="center"></Column>
                            <Column field="email" header="Email" align="center" alignHeader="center"></Column>
                            <Column body={acoesDataTable} exportable={false} style={{ minWidth: '12rem' }} align="center" header="Ações" alignHeader="center"></Column>
                        </DataTable>
                    </div>
                </Panel>

                <Dialog header="Detalhes do Locatário" visible={detalhesVisible} style={{ width: '30vw', minWidth: "30vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModal} draggable={false}>
                    <div className="card p-fluid">
                        <div className="field">
                            <label htmlFor='nome' style={{ marginBottom: '0.5rem' }}>Nome:</label>
                            <InputText id="nome" value={locatario.nome} onChange={(e) => setLocatario({ ...locatario, nome: e.target.value })} />
                        </div>

                        <div className="field">
                            <label htmlFor='telefone' style={{ marginBottom: '0.5rem' }}>Telefone:</label>
                            <InputMask id="telefone" value={locatario.telefone} onChange={(e) => setLocatario({ ...locatario, telefone: e.target.value })}
                                mask="(99) 9 9999-9999" placeholder="(99) 9 9999-9999" />
                        </div>

                        <div className="field">
                            <label htmlFor='email' style={{ marginBottom: '0.5rem' }}>Email:</label>
                            <InputText id="email" value={locatario.email} onChange={(e) => setLocatario({ ...locatario, email: e.target.value })} />
                        </div>
                    </div>
                </Dialog>

                <Dialog header="Buscar Locatário" visible={buscarVisible} style={{ width: '30vw', minWidth: "30vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModalBuscar} draggable={false}>
                    <div className="card p-fluid">
                        <div className="field">
                            <label htmlFor='id' style={{ marginBottom: '0.5rem' }}>Código:</label>
                            <InputText id="id" value={locatario.id} onChange={(e) => setLocatario({ ...locatario, id: e.target.value })} placeholder="Ex: 2a78" />
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={deleteLocatarioDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmação" modal footer={deleteLocatarioDialogFooter} onHide={hideDeleteLocatarioDialog}>
                    <div className="confirmation-content" style={{ display: "flex", alignItems: "center" }}>
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {locatario && (
                            <span>
                                Deseja realmente excluir o registro?
                            </span>
                        )}
                    </div>
                </Dialog>
            </div>

            <Rodape />
        </div>
    )
}