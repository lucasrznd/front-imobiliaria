
import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Badge } from 'primereact/badge';
import logo from '../../src/assets/images/logo-sgi.png';

export default function MenuApp() {
    const itemRenderer = (item) => (
        <a className="flex align-items-center p-menuitem-link">
            <span className={item.icon} />
            <span className="mx-2">{item.label}</span>
            {item.badge && <Badge className="ml-auto" value={item.badge} />}
            {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
        </a>
    );
    const items = [
        {
            label: 'Locatário',
            icon: 'pi pi-user'
        },
        {
            label: 'Proprietário',
            icon: 'pi pi-user'
        },
        {
            label: 'Imóvel',
            icon: 'pi pi-building',
        },
        {
            label: 'Contrato',
            icon: 'pi pi-file',
        }
    ];

    const start = <img alt="logos" src={logo} height={60} className="mr-2" />;

    return (
        <div className="card">
            <Menubar model={items} start={start} />
        </div>
    )
}
