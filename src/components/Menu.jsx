import React from 'react';
import { Menubar } from 'primereact/menubar';
import logo from '../../src/assets/images/logo-sgi.png';

export default function MenuApp() {

    const items = [
        {
            label: 'Imóvel',
            icon: 'pi pi-building',
            url: '/imovel'
        },
        {
            label: 'Parcela',
            icon: 'pi pi-wallet',
            url: '/parcela'
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
        },
        {
            label: 'Contrato',
            icon: 'pi pi-file',
            url: '/contrato'
        }
    ];

    const start = <a href='/home'><img alt="logos" src={logo} height={60} className="mr-2" /></a>

    return (
        <div className="card">
            <Menubar model={items} start={start} />
        </div>
    )
}
