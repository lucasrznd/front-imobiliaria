import MenuApp from "../components/Menu";
import { useState } from "react";
import Rodape from "../components/Rodape";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function Home() {
    const [qtdContratosAtivos, setQtdContratosAtivos] = useState(1);
    const [contratos, setContratos] = useState([
        { imovel: 'Casa', nome: 'Guilherme', dataInicio: '01/01/2024', dataFim: '06/01/2024', valorMensal: 500 }
    ]);
    const [qtdImoveis, setQtdImoveis] = useState(1);
    const [qtdProprietarios, setQtdProprietarios] = useState(1);

    const header = (
        <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
    );
    const footer = (
        <>
            <a href="/imovel" className="p-button font-bold">
                Navigate
            </a>
        </>
    );

    const formatarPreco = (rowData) => {
        if (rowData && rowData.valorMensal) {
            return 'R$ ' + rowData.valorMensal + ',00';
        }
    }

    return (
        <div>
            <MenuApp />

            <div className="grid mt-1">
                <div className="col-12 md:col-6 lg:col-3">
                    <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Contratos Ativos</span>
                                <div className="text-900 font-medium text-xl">{qtdContratosAtivos}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <a href="/contrato"><i className="pi pi-file text-blue-500 text-xl"></i></a>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">{qtdContratosAtivos} novos </span>
                        <span className="text-500">desde a última visita</span>
                    </div>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Imóveis</span>
                                <div className="text-900 font-medium text-xl">{qtdImoveis}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <a href="/imovel"><i className="pi pi-building text-cyan-500 text-xl"></i></a>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">{qtdImoveis}  </span>
                        <span className="text-500">novos registrados</span>
                    </div>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Proprietários Ativos</span>
                                <div className="text-900 font-medium text-xl">{qtdProprietarios}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <a href="/proprietario"><i className="pi pi-user text-purple-500 text-xl"></i></a>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">{qtdProprietarios} </span>
                        <span className="text-500">novos ativos</span>
                    </div>
                </div>
            </div>

            <div className="grid mt-2">
                <div className="col-12 md:col-6">
                    <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                        <div className="flex justify-content-between">
                            <div>
                                <span className="block text-primary font-medium mb-3">Últimos Contratos</span>
                            </div>
                        </div>
                        <DataTable value={contratos} paginator rows={5} emptyMessage="Nenhum contrato encontrado."
                            key="id" responsiveLayout="scroll">
                            <Column field="imovel" header="Imóvel" align="center" alignHeader="center"></Column>
                            <Column field="nome" header="Locatário" align="center" alignHeader="center"></Column>
                            <Column field="dataInicio" header="Data de Início" align="center" alignHeader="center"></Column>
                            <Column field="dataFim" header="Data de Término" align="center" alignHeader="center"></Column>
                            <Column field="valorMensal" body={formatarPreco} header="Valor Mensal" align="center" alignHeader="center"></Column>
                        </DataTable>
                    </div>
                </div>
            </div>

            <Rodape />
        </div>
    )
}
