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
import { dateFormatDt, parseDate } from "../functions/funcoesFormatacao";
import { formatarValorRealDatatable } from "../functions/funcoesFormatacao";
import { Checkbox } from "primereact/checkbox";
import { msgAviso, msgErro, msgSucesso } from "../util/ToastMessages";
import { useFormik } from "formik";
import { Tag } from "primereact/tag";
import { FilterMatchMode } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
import { localePtBr } from "../util/locale";

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
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'imovel.titulo': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [statuses] = useState(['true', 'false']);
    const toast = useRef();

    const formik = useFormik({
        initialValues: {
            imovel: {
                id: undefined,
                titulo: '',
                descricao: '',
                valorTotal: '',
                disponibilidadeTempo: '',
                status: false
            },
            locatario: {
                id: undefined,
                nome: '',
                telefone: undefined,
                email: ''
            },
            dataInicio: undefined,
            dataTermino: undefined,
            valorMensal: undefined,
            multa: undefined,
            status: false
        },
        validate: (dados) => {
            let errors = {};

            if (!dados.imovel.titulo) {
                errors.imovel = "O campo 'Imóvel' é obrigatório.";
            }

            if (!dados.locatario.nome) {
                errors.locatario = "O campo 'Locatário' é obrigatório.";
            }

            if (!dados.dataInicio) {
                errors.dataInicio = "O campo 'Data de Início' é obrigatório.";
            }

            if (!dados.dataTermino) {
                errors.dataTermino = "O campo 'Data de Término' é obrigatório.";
            }

            if (!dados.valorMensal) {
                errors.valorMensal = "O campo 'Valor Mensal' é obrigatório.";
            }

            if (!dados.multa) {
                errors.multa = "O campo 'Multa' é obrigatório.";
            }

            return errors;
        },
        onSubmit: async (values) => {
            if (values.id === undefined) {
                await contratoService.salvar(values);
                await listarContratos();
                fecharDetalhes();
                msgSucesso(toast, 'Contrato salvo com sucesso.');
            } else {
                await contratoService.editar(values);
                await listarContratos();
                fecharDetalhes();
                msgSucesso(toast, 'Contrato editado com sucesso.');
            }
        }
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const conteudoInicial = (
        <React.Fragment>
            <Button icon="pi pi-plus-circle" label='Novo' onClick={novoContratoAction} />
            <span style={{ margin: "10px" }} className="pi pi-ellipsis-v"></span>
            <Button icon="pi pi-search" label="Buscar" onClick={buscaContratoAction} />
        </React.Fragment>
    );

    function novoContratoAction() {
        formik.setFieldValue('id', undefined);
        formik.setFieldValue('imovel', {});
        formik.setFieldValue('locatario', {});
        formik.setFieldValue('dataInicio', undefined);
        formik.setFieldValue('dataTermino', undefined);
        formik.setFieldValue('valorMensal', undefined);
        formik.setFieldValue('multa', undefined);
        formik.setFieldValue('status', false);
        formik.resetForm();
        setDetalhesVisible(true);
    }

    function buscaContratoAction() {
        setBuscarVisible(true);
    }

    const acoesDataTable = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => detalhesContrato(rowData)} />
                <span className="pi pi-ellipsis-v mb-3" />
                <Button icon="pi pi-trash" rounded className="ml-2" severity="danger" onClick={() => confirmDeleteContrato(rowData)} />
            </React.Fragment>
        );
    };

    const detalhesContrato = (data) => {
        formik.setFieldValue('id', data.id);
        formik.setFieldValue('imovel', data.imovel);
        formik.setFieldValue('locatario', data.locatario);
        formik.setFieldValue('dataInicio', parseDate(data.dataInicio));
        formik.setFieldValue('dataTermino', parseDate(data.dataTermino));
        formik.setFieldValue('valorMensal', data.valorMensal);
        formik.setFieldValue('multa', data.multa);
        formik.setFieldValue('status', data.status);
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

    const confirmDeleteContrato = (rowData) => {
        formik.setValues(rowData);
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

    const buscarContratoAction = async () => {
        await buscarContratoPorId();
        setBuscarVisible(false);
    }

    const rodapeModal = (
        <div>
            <Button label="Salvar" icon="pi pi-check" type="submit" onClick={formik.handleSubmit} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharDetalhes} />
        </div>
    );

    const rodapeModalBuscar = (
        <div>
            <Button label="Buscar" icon="pi pi-check" onClick={buscarContratoAction} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharBusca} />
        </div>
    );

    const imovelAutocompleteItemTemplate = (item) => {
        const imovelDisplay = item.id + ' - ' + item.titulo + " - " + item.proprietario.nome;
        return <span>{imovelDisplay.toUpperCase()}</span>
    }

    const locatarioAutocompleteItemTemplate = (item) => {
        const locatario = item.nome;
        return <span>{locatario.toUpperCase()}</span>
    }

    const enderecoBodyTemplate = (rowData) => {
        const enderecoCompleto = rowData.imovel.endereco.rua + ', ' + rowData.imovel.endereco.bairro + ', ' + rowData.imovel.endereco.numero + ', ' + rowData.imovel.endereco.cidade;
        return <span>{enderecoCompleto.toUpperCase()}</span>
    }

    const valorMensalBodyTemplate = (rowData) => {
        return <span className="font-bold">{formatarValorRealDatatable(rowData, 'valorMensal')}</span>
    }

    const multaBodyTemplate = (rowData) => {
        return <span className="font-bold">{formatarValorRealDatatable(rowData, 'multa')}</span>
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

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Busca rápida" />
            </div>
        );
    };

    const header = renderHeader();

    const listarImoveis = async () => {
        try {
            const response = await imovelService.listarTodos();
            setImoveis(response.data);
        } catch (error) {
            msgSucesso(toast, 'Erro ao carregar imóveis.');
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
            msgErro(toast, 'Erro ao carregar locatários.');
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
            msgErro(toast, 'Erro ao carregar contratos.');
        }
    }

    const buscarContratoPorId = async () => {
        try {
            const response = await contratoService.buscarPorId(contrato.id);
            setContratos([response.data]);
            setContrato(new ContratoModel());
        } catch (error) {
            if (error.request.status === 404) {
                msgAviso(toast, 'Código inexistente.');
                return;
            }
            msgErro('Erro ao buscar imóvel.');
        }
    }

    const excluirContrato = async () => {
        await contratoService.excluir(formik.values.id);
        msgSucesso(toast, 'Contrato removido com sucesso.');
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
                            paginator header={header} rows={5} emptyMessage="Nenhum contrato encontrado." filters={filters}
                            key="id" filterDisplay="row" globalFilterFields={['titulo', 'imovel.titulo', 'imovel.endereco.rua', 'imovel.proprietario.nome', 'locatario.nome']} globalFilterMatchMode="startsWith">
                            <Column field="imovel.titulo" header="Imóvel" body={(rowData) => rowData.imovel.titulo.toUpperCase()} align="center" alignHeader="center" />
                            <Column field="imovel.endereco.rua" header="Endereço" body={enderecoBodyTemplate} align="center" alignHeader="center" />
                            <Column field="imovel.proprietario.nome" header="Proprietário" body={(rowData) => rowData.imovel.proprietario.nome.toUpperCase()} align="center" alignHeader="center" />
                            <Column field="locatario.nome" header="Locatário" body={(rowData) => rowData.locatario.nome.toUpperCase()} align="center" alignHeader="center" />
                            <Column field="dataInicio" header="Data de Início" body={(rowData) => dateFormatDt(rowData, "dataInicio")} align="center" alignHeader="center" />
                            <Column field="dataTermino" header="Data de Término" body={(rowData) => dateFormatDt(rowData, 'dataTermino')} align="center" alignHeader="center" />
                            <Column field="valorMensal" header="Valor Mensal" body={valorMensalBodyTemplate} align="center" alignHeader="center" />
                            <Column field="multa" header="Multa" body={multaBodyTemplate} align="center" alignHeader="center" />
                            <Column field="status" body={statusBodyTemplate} header="Ativo" align="center" alignHeader="center"
                                showFilterMenu={false} filter filterElement={statusRowFilterTemplate}
                                filterHeaderStyle={{ width: "5rem" }} />
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
                                <AutoComplete id="imovel" value={formik.values.imovel} suggestions={imoveisFiltrados}
                                    field="titulo" completeMethod={completeMethodImoveis} onChange={formik.handleChange}
                                    itemTemplate={imovelAutocompleteItemTemplate}
                                    className={isFormFieldValid('imovel') ? "p-invalid uppercase" : "uppercase"} />
                                {getFormErrorMessage('imovel')}
                            </div>
                            <div className="field col">
                                <label htmlFor='locatario' style={{ marginBottom: '0.5rem' }}>Locatário:</label>
                                <AutoComplete id="locatario" value={formik.values.locatario} suggestions={locatariosFiltrados}
                                    field="nome" completeMethod={completeMethodLocatarios}
                                    onChange={formik.handleChange} itemTemplate={locatarioAutocompleteItemTemplate}
                                    className={isFormFieldValid('locatario') ? "p-invalid uppercase" : "uppercase"} />
                                {getFormErrorMessage('locatario')}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor='dataInicio' style={{ marginBottom: '0.5rem' }}>Data de Ínicio:</label>
                                <Calendar inputId="dataInicio" value={formik.values.dataInicio}
                                    onChange={(e) => formik.setFieldValue('dataInicio', new Date(e.value))}
                                    showIcon dateFormat="dd/mm/yy" locale="pt-BR"
                                    className={isFormFieldValid('dataInicio') ? "p-invalid uppercase" : "uppercase"} />
                                {getFormErrorMessage('dataInicio')}
                            </div>
                            <div className="field col">
                                <label htmlFor='dataFim' style={{ marginBottom: '0.5rem' }}>Data de Término:</label>
                                <Calendar id="dataFim" value={formik.values.dataTermino}
                                    onChange={(e) => formik.setFieldValue('dataTermino', new Date(e.value))}
                                    showIcon dateFormat="dd/mm/yy" locale="pt-BR"
                                    className={isFormFieldValid('dataTermino') ? "p-invalid uppercase" : "uppercase"} />
                                {getFormErrorMessage('dataTermino')}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor='valorMensal' style={{ marginBottom: '0.5rem' }}>Valor Mensal:</label>
                                <InputNumber
                                    id="valorMensal"
                                    name="valorMensal"
                                    value={formik.values.valorMensal}
                                    onValueChange={formik.handleChange}
                                    mode="currency" currency="BRL" locale="pt-BR"
                                    placeholder="R$ 500,00"
                                    className={isFormFieldValid('valorMensal') ? "p-invalid uppercase" : "uppercase"} />
                                {getFormErrorMessage('valorMensal')}
                            </div>
                            <div className="field col">
                                <label htmlFor='multa' style={{ marginBottom: '0.5rem' }}>Multa:</label>
                                <InputNumber
                                    id="multa"
                                    name="multa"
                                    value={formik.values.multa}
                                    onValueChange={formik.handleChange}
                                    mode="currency" currency="BRL" locale="pt-BR"
                                    placeholder="R$ 500,00"
                                    className={isFormFieldValid('multa') ? "p-invalid uppercase" : "uppercase"} />
                                {getFormErrorMessage('multa')}
                            </div>
                        </div>
                        <div className="field">
                            <div className="flex align-items-center justify-content-center">
                                <label htmlFor='status'>Ativo:</label>
                                <Checkbox id="status"
                                    onChange={formik.handleChange}
                                    checked={formik.values.status} className="ml-1" />
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