import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import MenuApp from "../components/Menu";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { Toolbar } from "primereact/toolbar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Checkbox } from "primereact/checkbox";
import Rodape from "../components/Rodape";
import { ProprietarioService } from "../services/ProprietarioService";
import { msgAviso, msgErro, msgSucesso } from "../util/ToastMessages";
import { useFormik } from "formik";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";

export default function CadastroProprietario() {
    const [proprietarios, setProprietarios] = useState([]);
    const proprietarioService = new ProprietarioService();

    const [detalhesVisible, setDetalhesVisible] = useState(false);
    const [buscarVisible, setBuscarVisible] = useState(false);
    const [deleteProprietarioDialog, setDeleteProprietarioDialog] = useState(false);
    const [statuses] = useState(['true', 'false']);
    const toast = useRef();

    const formik = useFormik({
        initialValues: {
            id: undefined,
            nome: '',
            telefone: undefined,
            ativo: false
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
        onSubmit: async (values, actions) => {
            if (values.id === undefined) {
                await proprietarioService.salvar(values);
                await listarProprietarios();
                fecharDetalhes();
                msgSucesso(toast, 'Proprietário salvo com sucesso.');
            } else {
                await proprietarioService.editar(values);
                await listarProprietarios();
                msgSucesso(toast, 'Proprietário editado com sucesso.');
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
            <Button icon="pi pi-plus-circle" label='Novo' onClick={novoProprietarioAction} />
            <span style={{ margin: "10px" }} className="pi pi-ellipsis-v"></span>
            <Button icon="pi pi-search" label="Buscar" onClick={buscaProprietarioAction} />
        </React.Fragment>
    );

    function novoProprietarioAction() {
        formik.setFieldValue('id', undefined);
        formik.setFieldValue('nome', '');
        formik.setFieldValue('telefone', undefined);
        formik.setFieldValue('ativo', false);
        formik.resetForm();
        setDetalhesVisible(true);
    }

    function buscaProprietarioAction() {
        setBuscarVisible(true);
    }

    const acoesDataTable = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => detalhesProprietario(rowData)} />
                <span style={{ margin: "15px" }} className="pi pi-ellipsis-v"></span>
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteProprietario(rowData)} />
            </React.Fragment>
        );
    };

    const detalhesProprietario = (data) => {
        formik.resetForm();
        formik.setFieldValue('id', data.id);
        formik.setFieldValue('nome', data.nome);
        formik.setFieldValue('telefone', data.telefone);
        formik.setFieldValue('ativo', data.ativo);
        setDetalhesVisible(true);
    }

    const fecharDetalhes = () => {
        setDetalhesVisible(false);
    }

    const fecharBusca = () => {
        setBuscarVisible(false);
    }

    const deletarProprietario = async (rowData) => {
        await excluirProprietario(rowData);
        await listarProprietarios();
        setDeleteProprietarioDialog(false);
    }

    const confirmDeleteProprietario = (rowData) => {
        formik.setValues(rowData);
        setDeleteProprietarioDialog(true);
    }

    const hideDeleteProprietarioDialog = () => {
        setDeleteProprietarioDialog(false);
    }

    const deleteProprietarioDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDeleteProprietarioDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deletarProprietario} />
        </React.Fragment>
    );

    const buscarProprietarioAction = async () => {
        formik.resetForm();
        await buscarProprietarioPorId();
    }

    const rodapeModal = (
        <div>
            <Button label="Salvar" type="submit" icon="pi pi-check" onClick={formik.handleSubmit} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharDetalhes} />
        </div>
    );

    const rodapeModalBuscar = (
        <div>
            <Button label="Buscar" icon="pi pi-check" onClick={buscarProprietarioAction} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharBusca} />
        </div>
    );

    const ativoBodyTemplate = (rowData) => {
        if (rowData.ativo) {
            return <Tag value="SIM" severity="success" />
        }
        return <Tag value="NÃO" severity="danger" />
    }

    const statusItemTemplate = (option) => {
        if (option === 'true') {
            return <Tag value="SIM" severity="success" />;
        }
        return <Tag value="NÃO" severity="danger" />;
    };

    const statusRowFilterTemplate = (options) => {
        return (
            <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={statusItemTemplate} placeholder="Selecione um status" className="p-column-filter" showClear style={{ minWidth: '12rem' }} />
        );
    };

    const listarProprietarios = async () => {
        try {
            const response = await proprietarioService.listarTodos();
            setProprietarios(response.data);
        } catch (error) {
            msgErro(toast, 'Erro ao carregar proprietários.')
        }
    }

    const buscarProprietarioPorId = async () => {
        try {
            const response = await proprietarioService.buscarPorId(formik.values.id);
            if (response.data.length !== 0) {
                setProprietarios([response.data]);
                msgSucesso(toast, 'Proprietário encontrado com sucesso.');
                setBuscarVisible(false);
                return;
            }
            await listarProprietarios();
            msgAviso(toast, 'Nenhum proprietário encontrado com o Id: ' + formik.values.id);
        } catch (error) {
            msgErro(toast, 'Erro ao buscar proprietário.');
        }
    }

    const excluirProprietario = async () => {
        await proprietarioService.excluir(formik.values.id);
        msgSucesso(toast, 'Proprietário removido com sucesso.');
    }

    useEffect(() => {
        listarProprietarios();
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
                        <DataTable value={proprietarios} tableStyle={{ minWidth: '50rem' }}
                            paginator header="Proprietários" rows={5} emptyMessage="Nenhum proprietário encontrado."
                            key="id" filterDisplay="row" globalFilterFields={['nome', 'ativo']} globalFilterMatchMode="startsWith">
                            <Column field="id" header="Código" align="center" alignHeader="center"></Column>
                            <Column field="nome" body={(rowData) => rowData.nome.toUpperCase()}
                                filterField="nome" showFilterMenu={false} filterMatchMode="contains" filter filterHeaderStyle={{ width: '25rem' }}
                                sortable header="Nome" align="center" alignHeader="center"></Column>
                            <Column field="telefone" header="Telefone" align="center" alignHeader="center"></Column>
                            <Column field="ativo" body={ativoBodyTemplate} header="Ativo" align="center" alignHeader="center"
                                showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }}
                                filter filterElement={statusRowFilterTemplate} filterHeaderStyle={{ width: "20rem" }} />
                            <Column body={acoesDataTable} exportable={false} style={{ minWidth: '12rem' }} align="center" header="Ações" alignHeader="center"></Column>
                        </DataTable>
                    </div>
                </Panel>

                <Dialog header="Detalhes do Proprietário" visible={detalhesVisible} style={{ width: '30vw', minWidth: "30vw" }} onHide={() => setDetalhesVisible(false)}
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
                                className={isFormFieldValid('telefone') ? "p-invalid uppercase" : "uppercase"} />
                            {getFormErrorMessage('telefone')}
                        </div>

                        <div className="field">
                            <div className="flex align-items-center justify-content-center">
                                <label htmlFor='ativo' style={{ marginBottom: '0.5rem' }}>Ativo:</label>
                                <Checkbox
                                    id="ativo"
                                    checked={formik.values.ativo}
                                    onChange={(e) => formik.setFieldValue('ativo', e.checked)}
                                    className="ml-1" />
                            </div>
                        </div>
                    </div>
                </Dialog>

                <Dialog header="Buscar Proprietário" visible={buscarVisible} style={{ width: '30vw', minWidth: "30vw" }} onHide={fecharBusca}
                    footer={rodapeModalBuscar} draggable={false}>
                    <div className="card p-fluid">
                        <div className="field">
                            <label htmlFor='id' style={{ marginBottom: '0.5rem' }}>Código:</label>
                            <InputText id="id" value={formik.values.id} onChange={formik.handleChange}
                                placeholder="Ex: 1" />
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={deleteProprietarioDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmação" modal footer={deleteProprietarioDialogFooter} onHide={hideDeleteProprietarioDialog}>
                    <div className="confirmation-content" style={{ display: "flex", alignItems: "center" }}>
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {(
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