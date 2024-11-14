import React, { useEffect, useRef, useState } from "react";
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
import { InputTextarea } from "primereact/inputtextarea";
import { AutoComplete } from "primereact/autocomplete";
import { InputNumber } from "primereact/inputnumber";
import { ImovelService } from "../services/ImovelService";
import { ProprietarioService } from "../services/ProprietarioService";
import { Checkbox } from "primereact/checkbox";
import { useFormik } from "formik";
import { getIn } from 'formik';
import { msgAviso, msgErro, msgSucesso } from "../util/ToastMessages";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { formatarValorRealDatatable } from "../functions/funcoesFormatacao";

export default function CadastroImovel() {
    const [imoveis, setImoveis] = useState([]);
    const imovelService = new ImovelService();
    const [proprietarios, setProprietarios] = useState([]);
    const [items, setItems] = useState([]);
    const proprietarioService = new ProprietarioService();

    const [detalhesVisible, setDetalhesVisible] = useState(false);
    const [buscarVisible, setBuscarVisible] = useState(false);
    const [deleteImovelDialog, setDeleteImovelDialog] = useState(false);
    const [statuses] = useState(['true', 'false']);
    const toast = useRef();

    const formik = useFormik({
        initialValues: {
            id: undefined,
            titulo: '',
            descricao: '',
            proprietario: {
                id: undefined,
                nome: '',
                telefone: '',
                ativo: undefined
            },
            endereco: {
                id: undefined,
                rua: '',
                bairro: '',
                numero: undefined,
                cidade: ''
            },
            valorTotal: '',
            disponibilidadeTempo: '',
            status: false
        },
        validate: (dados) => {
            let errors = {};

            if (!dados.titulo) {
                errors.titulo = "O campo 'Título' é obrigatório.";
            }

            if (!dados.descricao) {
                errors.descricao = "O campo 'Descrição' é obrigatório.";
            }

            if (!dados.proprietario.nome) {
                errors.proprietario = "O campo 'Proprietário' é obrigatório.";
            }

            if (!dados.endereco.rua || !dados.endereco.bairro || !dados.endereco.numero
                || !dados.endereco.cidade) {
                errors.endereco = {};

                if (!dados.endereco.rua) {
                    errors.endereco.rua = "O campo 'Rua' é obrigatório.";
                }

                if (!dados.endereco.bairro) {
                    errors.endereco.bairro = "O campo 'Bairro' é obrigatório.";
                }

                if (!dados.endereco.numero) {
                    errors.endereco.numero = "O campo 'Número' é obrigatório.";
                }

                if (!dados.endereco.cidade) {
                    errors.endereco.cidade = "O campo 'Cidade' é obrigatório.";
                }
            }

            if (!dados.valorTotal) {
                errors.valorTotal = "O campo 'Valor Total' é obrigatório.";
            }

            if (!dados.disponibilidadeTempo) {
                errors.disponibilidadeTempo = "O campo 'Disponibilidade de Tempo' é obrigatório.";
            }

            return errors;
        },
        onSubmit: async (values) => {
            if (values.id === undefined) {
                await imovelService.salvar(values);
                await listarImoveis();
                fecharDetalhes();
                msgSucesso(toast, 'Imóvel salvo com sucesso.');
            } else {
                await imovelService.editar(values);
                await listarImoveis();
                msgSucesso(toast, 'Imóvel editado com sucesso.');
                fecharDetalhes();
            }
        }
    });

    const isFormFieldValid = (name) => {
        const fieldTouched = getIn(formik.touched, name);
        const fieldError = getIn(formik.errors, name);
        return !!(fieldTouched && fieldError);
    };

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && (
            <small className="p-error">{getIn(formik.errors, name)}</small>
        );
    };

    const conteudoInicial = (
        <React.Fragment>
            <Button icon="pi pi-plus-circle" label='Novo' onClick={novoImovelAction} />
            <span style={{ margin: "10px" }} className="pi pi-ellipsis-v"></span>
            <Button icon="pi pi-search" label="Buscar" onClick={buscaImovelAction} />
        </React.Fragment>
    );

    function novoImovelAction() {
        formik.setFieldValue('id', undefined);
        formik.setFieldValue('titulo', '');
        formik.setFieldValue('descricao', '');
        formik.setFieldValue('proprietario', {});
        formik.setFieldValue('endereco', {
            id: undefined,
            rua: '',
            bairro: '',
            numero: undefined,
            cidade: ''
        });
        formik.setFieldValue('valorTotal', '');
        formik.setFieldValue('disponibilidadeTempo', '');
        formik.setFieldValue('status', false);
        formik.resetForm();
        setDetalhesVisible(true);
    }

    function buscaImovelAction() {
        setBuscarVisible(true);
    }

    const acoesDataTable = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => detalhesImovel(rowData)} />
                <span style={{ margin: "15px" }} className="pi pi-ellipsis-v"></span>
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteImovel(rowData)} />
            </React.Fragment>
        );
    };

    const detalhesImovel = (data) => {
        formik.resetForm();
        formik.setFieldValue('id', data.id);
        formik.setFieldValue('titulo', data.titulo);
        formik.setFieldValue('descricao', data.descricao);
        formik.setFieldValue('proprietario', data.proprietario);
        formik.setFieldValue('endereco', data.endereco);
        formik.setFieldValue('valorTotal', data.valorTotal);
        formik.setFieldValue('disponibilidadeTempo', data.disponibilidadeTempo);
        formik.setFieldValue('status', data.status);
        setDetalhesVisible(true);
    }

    const fecharDetalhes = () => {
        setDetalhesVisible(false);
    }

    const fecharBusca = () => {
        setBuscarVisible(false);
    }

    const deletarImovel = async () => {
        setDeleteImovelDialog(false);
        await excluirImovel();
        await listarImoveis();
    }

    const confirmDeleteImovel = (rowData) => {
        formik.setValues(rowData);
        setDeleteImovelDialog(true);
    }

    const hideDeleteImovelDialog = () => {
        setDeleteImovelDialog(false);
    }

    const deleteImovelDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDeleteImovelDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deletarImovel} />
        </React.Fragment>
    );

    const buscarImovelAction = async () => {
        formik.resetForm();
        await buscarImovelPorId();
    }

    const rodapeModal = (
        <div>
            <Button label="Salvar" icon="pi pi-check" type="submit" onClick={formik.handleSubmit} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharDetalhes} />
        </div>
    );

    const rodapeModalBuscar = (
        <div>
            <Button label="Buscar" icon="pi pi-check" onClick={buscarImovelAction} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharBusca} />
        </div>
    );

    const enderecoBodyTemplate = (rowData) => {
        const enderecoCompleto = rowData.endereco.rua + ', ' + rowData.endereco.bairro + ', ' + rowData.endereco.numero + ', ' + rowData.endereco.cidade;
        return <span>{enderecoCompleto.toUpperCase()}</span>
    }

    const valorTotalBodyTemplate = (rowData) => {
        return <span className="font-bold">{formatarValorRealDatatable(rowData, 'valorTotal')}</span>
    }

    const statusBodyTemplate = (rowData) => {
        if (rowData.status) {
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
            <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={statusItemTemplate} placeholder="Selecione" className="p-column-filter" showClear style={{ width: '11rem' }} />
        );
    };

    const listarProprietarios = async () => {
        try {
            const response = await proprietarioService.listarTodos();
            setProprietarios(response.data);
        } catch (error) {
            msgErro(toast, 'Erro ao carregar proprietários.');
        }
    }

    const completeMethod = (ev) => {
        const sugestoesFiltradas = proprietarios.filter(p => p.nome.toLowerCase().includes(ev.query.toLowerCase()));

        setItems(sugestoesFiltradas);

        return sugestoesFiltradas;
    };

    const listarImoveis = async () => {
        try {
            const response = await imovelService.listarTodos();
            setImoveis(response.data);
        } catch (error) {
            msgErro(toast, 'Erro ao carregar imóveis.');
        }
    }

    const buscarImovelPorId = async () => {
        try {
            const response = await imovelService.buscarPorId(formik.values.id);
            if (response.data !== '') {
                setImoveis([response.data]);
                msgSucesso(toast, 'Imóvel encontrado com sucesso.');
                setBuscarVisible(false);
                return;
            }
            await listarImoveis();
            msgAviso(toast, 'Nenhum imóvel encontrado com o Id: ' + formik.values.id);
        } catch (error) {
            msgErro(toast, 'Erro ao buscar imóvel.');
        }
    }

    const excluirImovel = async () => {
        await imovelService.excluir(formik.values.id);
        msgAviso(toast, 'Imóvel removido com sucesso.');
    }

    useEffect(() => {
        listarImoveis();
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
                        <DataTable value={imoveis} tableStyle={{ minWidth: '50rem' }}
                            paginator header="Imóvel" rows={5} emptyMessage="Nenhum imóvel encontrado."
                            key="id" filterDisplay="row" globalFilterFields={['titulo', 'proprietario.nome']} globalFilterMatchMode="startsWith">
                            <Column field="titulo" header="Título" body={(rowData) => rowData.titulo.toUpperCase()} filterField="titulo" showFilterMenu={false}
                                filterMatchMode="contains" filter filterHeaderStyle={{ width: "15rem" }}
                                align="center" alignHeader="center" />
                            <Column field="proprietario.nome" header="Proprietário" body={(rowData) => rowData.proprietario.nome.toUpperCase()} filterField="proprietario.nome" showFilterMenu={false}
                                filterMatchMode="contains" filter filterHeaderStyle={{ width: "15rem" }} filterHeaderClassName="center-filter"
                                align="center" alignHeader="center" />
                            <Column field="endereco" header="Endereço" body={enderecoBodyTemplate} align="center" alignHeader="center" />
                            <Column field="valorTotal" body={valorTotalBodyTemplate} header="Valor Total" align="center" alignHeader="center" bodyStyle={{ width: "10rem" }} />
                            <Column field="disponibilidadeTempo" header="Disponibilidade (meses)" align="center" alignHeader="center" />
                            <Column field="status" body={statusBodyTemplate} header="Ativo" align="center" alignHeader="center"
                                showFilterMenu={false} filter filterElement={statusRowFilterTemplate}
                                filterHeaderStyle={{ width: "5rem" }} />
                            <Column body={acoesDataTable} exportable={false} style={{ minWidth: '12rem' }} align="center" header="Ações" alignHeader="center" />
                        </DataTable>
                    </div>
                </Panel>

                <Dialog header="Detalhes do Imóvel" visible={detalhesVisible} style={{ width: '45vw', minWidth: "40vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModal} draggable={false}>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor='titulo' style={{ marginBottom: '0.5rem' }}>Título:</label>
                            <InputText id="titulo" name="titulo" value={formik.values.titulo}
                                onChange={formik.handleChange}
                                className={isFormFieldValid('titulo') ? "p-invalid uppercase" : "uppercase"} />
                            {getFormErrorMessage('titulo')}
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor='proprietario' style={{ marginBottom: '0.5rem' }}>Proprietário:</label>
                            <AutoComplete id="proprietario" name="proprietario"
                                value={formik.values.proprietario}
                                suggestions={items} field="nome"
                                completeMethod={completeMethod} onChange={formik.handleChange}
                                className={isFormFieldValid('proprietario') ? "p-invalid uppercase" : "uppercase"} />
                            {getFormErrorMessage('proprietario')}
                        </div>

                        <div className="field col-12">
                            <label htmlFor='descricao' style={{ marginBottom: '0.5rem' }}>Descrição:</label>
                            <InputTextarea id="descricao" name="descricao" value={formik.values.descricao}
                                onChange={formik.handleChange} rows={4}
                                className={isFormFieldValid('descricao') ? "p-invalid uppercase" : "uppercase"} />
                            {getFormErrorMessage('descricao')}
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor='disponibilidadeTempo' style={{ marginBottom: '0.5rem' }}>Disponibilidade (meses):</label>
                            <InputNumber id="disponibilidadeTempo" name="disponibilidadeTempo" inputId="disponibilidadeTempo" value={formik.values.disponibilidadeTempo}
                                onValueChange={formik.handleChange} placeholder="6" mode="decimal" showButtons min={1} max={12}
                                className={isFormFieldValid('disponibilidadeTempo') ? "p-invalid uppercase" : "uppercase"} />
                            {getFormErrorMessage('disponibilidadeTempo')}
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor='valorTotal' style={{ marginBottom: '0.5rem' }}>Valor Total:</label>
                            <InputNumber id="valorTotal" name="valorTotal" value={formik.values.valorTotal}
                                onValueChange={formik.handleChange} mode="currency" currency="BRL" locale="pt-BR" placeholder="R$ 1.000,00"
                                className={isFormFieldValid('valorTotal') ? "p-invalid uppercase" : "uppercase"} />
                            {getFormErrorMessage('valorTotal')}
                        </div>

                        <div className="field col-12 mb-1">
                            <h2 style={{ color: "#069669" }}>Endereço</h2>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor='endereco.rua' style={{ marginBottom: '0.5rem' }}>Rua:</label>
                            <InputText
                                id="endereco.rua"
                                name="endereco.rua"
                                value={formik.values.endereco.rua}
                                onChange={formik.handleChange}
                                className={isFormFieldValid('endereco.rua') ? "p-invalid uppercase" : "uppercase"} />
                            {getFormErrorMessage('endereco.rua')}
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor='bairro' style={{ marginBottom: '0.5rem' }}>Bairro:</label>
                            <InputText id="bairro" name="endereco.bairro" value={formik.values.endereco.bairro}
                                onChange={formik.handleChange}
                                className={isFormFieldValid('endereco.bairro') ? "p-invalid uppercase" : "uppercase"} />
                            {getFormErrorMessage('endereco.bairro')}
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor='numero' style={{ marginBottom: '0.5rem' }}>Número:</label>
                            <InputText id="numero" name="endereco.numero" value={formik.values.endereco.numero}
                                onChange={formik.handleChange}
                                className={isFormFieldValid('endereco.numero') ? "p-invalid uppercase" : "uppercase"} />
                            {getFormErrorMessage('endereco.numero')}
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor='cidade' style={{ marginBottom: '0.5rem' }}>Cidade:</label>
                            <InputText id="cidade" name="endereco.cidade" value={formik.values.endereco.cidade}
                                onChange={formik.handleChange}
                                className={isFormFieldValid('endereco.cidade') ? "p-invalid uppercase" : "uppercase"} />
                            {getFormErrorMessage('endereco.cidade')}
                        </div>
                    </div>
                    <div className="field">
                        <div className="flex align-items-center justify-content-center">
                            <label htmlFor='status' style={{ marginBottom: '0.5rem' }}>Ativo:</label>
                            <Checkbox id="status" onChange={formik.handleChange} checked={formik.values.status} className="ml-1" />
                        </div>
                    </div>
                </Dialog>

                <Dialog header="Buscar Imóvel" visible={buscarVisible} style={{ width: '30vw', minWidth: "30vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModalBuscar} draggable={false}>
                    <div className="card p-fluid">
                        <div className="field">
                            <label htmlFor='id' style={{ marginBottom: '0.5rem' }}>Código:</label>
                            <InputText id="id" value={formik.values.id}
                                onChange={formik.handleChange} placeholder="Ex: 1" />
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={deleteImovelDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmação" modal footer={deleteImovelDialogFooter} onHide={hideDeleteImovelDialog}>
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