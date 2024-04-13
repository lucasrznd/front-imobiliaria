import React from 'react';
import logo from '../../src/assets/images/logo-sgi.png';
import { MegaMenu } from 'primereact/megamenu';

export default function MenuApp() {

    const items = [
        {
            label: 'Contrato',
            icon: 'pi pi-file',
            url: '/contrato'
        },
        {
            label: 'Parcela',
            icon: 'pi pi-wallet',
            url: '/parcela'
        },
        {
            label: 'Imóvel',
            icon: 'pi pi-building',
            url: '/imovel'
        },
        {
            label: 'Locatário',
            icon: 'pi pi-user',
            url: '/locatario'
        },
        {
            label: 'Proprietário',
            icon: 'pi pi-user',
            url: '/proprietario'
        }
    ];

    const start = <a href='/home'><img alt="logos" src={logo} height={60} className="mr-2" /></a>

    return (
        <div className="card">
            <MegaMenu model={items} orientation="horizontal" start={start} breakpoint="960px" className="p-3 surface-0 shadow-2 mb-2" style={{ borderRadius: '1rem' }} />
        </div>
    )
}
