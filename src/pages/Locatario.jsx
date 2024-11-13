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
import { LocatarioService } from "../services/LocatarioService";
import { useFormik } from "formik";
import { msgAviso, msgErro, msgSucesso } from "../util/ToastMessages";

export default function CadastroLocatario() {
    const [locatarios, setLocatarios] = useState([]);
    const locatarioService = new LocatarioService();

    const [detalhesVisible, setDetalhesVisible] = useState(false);
    const [buscarVisible, setBuscarVisible] = useState(false);
    const [deleteLocatarioDialog, setDeleteLocatarioDialog] = useState(false);
    const toast = useRef();

    const formik = useFormik({
        initialValues: {
            id: undefined,
            nome: '',
            telefone: undefined,
            email: ''
        },
        validate: (dados) => {
            let errors = {};

            if (!dados.nome) {
                errors.nome = "O campo 'Nome' é obrigatório.";
            }

            if (!dados.telefone) {
                errors.telefone = "O campo 'Telefone' é obrigatório.";
            }

            return errors;
        },
        onSubmit: async (values) => {
            if (values.id === undefined) {
                await locatarioService.salvar(values);
                await listarLocatarios();
                fecharDetalhes();
                msgSucesso(toast, 'Locatário salvo com sucesso.');
            } else {
                await locatarioService.editar(values);
                await listarLocatarios();
                msgSucesso(toast, 'Locatário editado com sucesso.');
                fecharDetalhes();
            }
        }
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const conteudoInicial = (
        <React.Fragment>
            <Button icon="pi pi-plus-circle" label='Novo' onClick={novoLocatarioAction} />
            <span style={{ margin: "10px" }} className="pi pi-ellipsis-v"></span>
            <Button icon="pi pi-search" label="Buscar" onClick={buscaLocatarioAction} />
        </React.Fragment>
    );

    function novoLocatarioAction() {
        formik.setFieldValue('id', undefined);
        formik.setFieldValue('nome', '');
        formik.setFieldValue('telefone', undefined);
        formik.setFieldValue('email', '');
        formik.resetForm();
        setDetalhesVisible(true);
    }

    function buscaLocatarioAction() {
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

    const detalhesLocatario = (data) => {
        formik.resetForm();
        formik.setFieldValue('id', data.id);
        formik.setFieldValue('nome', data.nome);
        formik.setFieldValue('telefone', data.telefone);
        formik.setFieldValue('email', data.email);
        setDetalhesVisible(true);
    };

    const fecharDetalhes = () => {
        setDetalhesVisible(false);
    }

    const fecharBusca = () => {
        setBuscarVisible(false);
    }

    const deletarLocatario = async () => {
        await excluirLocatario();
        await listarLocatarios();
        setDeleteLocatarioDialog(false);
    }

    const confirmDeleteLocatario = (rowData) => {
        formik.setValues(rowData);
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

    const buscarLocatarioAction = async () => {
        formik.resetForm();
        await buscarLocatarioPorId();
    }

    const rodapeModal = (
        <div>
            <Button label="Salvar" icon="pi pi-check" onClick={formik.handleSubmit} autoFocus />
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
            const response = await locatarioService.buscarPorId(formik.values.id);
            if (response.data.length !== 0) {
                setLocatarios([response.data]);
                msgSucesso(toast, 'Locatário encontrado com sucesso.');
                setBuscarVisible(false);
                return;
            }
            await listarLocatarios();
            msgAviso(toast, 'Nenhum locatário encontrado com o Id: ' + formik.values.id);
        } catch (error) {
            msgErro('Erro ao buscar locatário.');
        }
    }

    const excluirLocatario = async () => {
        await locatarioService.excluir(formik.values.id);
        msgSucesso('Locatário removido com sucesso.');
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
                            key="id" filterDisplay="row" globalFilterFields={['nome']} globalFilterMatchMode="startsWith">
                            <Column field="id" header="Código" align="center" alignHeader="center"></Column>
                            <Column field="nome" header="Nome" body={(rowData) => rowData.nome.toUpperCase()}
                                filterField="nome" showFilterMenu={false} filterMatchMode="contains" filter
                                sortable align="center" alignHeader="center"></Column>
                            <Column field="telefone" header="Telefone" align="center" alignHeader="center"></Column>
                            <Column field="email" header="Email" body={(rowData) => rowData.email.toLowerCase()} align="center" alignHeader="center"></Column>
                            <Column body={acoesDataTable} exportable={false} style={{ minWidth: '12rem' }} align="center" header="Ações" alignHeader="center"></Column>
                        </DataTable>
                    </div>
                </Panel>

                <Dialog header="Detalhes do Locatário" visible={detalhesVisible} style={{ width: '30vw', minWidth: "30vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModal} draggable={false}>
                    <div className="card p-fluid">
                        <div className="field">
                            <label htmlFor='nome' style={{ marginBottom: '0.5rem' }}>Nome:</label>
                            <InputText id="nome" value={formik.values.nome}
                                onChange={formik.handleChange}
                                className={isFormFieldValid('nome') ? "p-invalid uppercase" : "uppercase"} />
                            {getFormErrorMessage('nome')}
                        </div>

                        <div className="field">
                            <label htmlFor='telefone' style={{ marginBottom: '0.5rem' }}>Telefone:</label>
                            <InputMask id="telefone" value={formik.values.telefone}
                                onChange={formik.handleChange}
                                mask="(99) 9 9999-9999" placeholder="(99) 9 9999-9999"
                                className={isFormFieldValid('nome') ? "p-invalid uppercase" : "uppercase"} />
                            {getFormErrorMessage('telefone')}
                        </div>

                        <div className="field">
                            <label htmlFor='email' style={{ marginBottom: '0.5rem' }}>Email:</label>
                            <InputText id="email" value={formik.values.email}
                                onChange={formik.handleChange} />
                        </div>
                    </div>
                </Dialog>

                <Dialog header="Buscar Locatário" visible={buscarVisible} style={{ width: '30vw', minWidth: "30vw" }} onHide={fecharBusca}
                    footer={rodapeModalBuscar} draggable={false}>
                    <div className="card p-fluid">
                        <div className="field">
                            <label htmlFor='id' style={{ marginBottom: '0.5rem' }}>Código:</label>
                            <InputText id="id" value={formik.values.id}
                                onChange={formik.handleChange} placeholder="Ex: 1" />
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={deleteLocatarioDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmação" modal footer={deleteLocatarioDialogFooter} onHide={hideDeleteLocatarioDialog}>
                    <div className="confirmation-content" style={{ display: "flex", alignItems: "center" }}>
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {(
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