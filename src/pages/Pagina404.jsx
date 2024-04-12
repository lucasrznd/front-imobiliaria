import logo from '../assets/images/logo-sgi.png';

export default function Pagina404() {
    return (
        <div>
            <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
                <div className="flex flex-column align-items-center justify-content-center">
                    <img src={logo} alt="sgi-logo" className="mb-5 w-8rem flex-shrink-0" />
                    <div
                        style={{
                            borderRadius: '56px',
                            padding: '0.3rem',
                            background: 'linear-gradient(180deg, rgba(6, 150, 105, 0.4) 10%, rgba(6, 150, 105, 0) 60%)'
                        }}
                    >
                        <div className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style={{ borderRadius: '53px' }}>
                            <span className="text-primary font-bold text-3xl">404</span>
                            <h1 className="text-900 font-bold text-5xl mb-2">Não encontrado</h1>
                            <div className="text-600 mb-5">O conteúdo solicitado não está disponível</div>

                            <a href="/home" className="p-button font-bold no-underline">
                                <div className="flex flex-row align-items-center justify-content-center">
                                    <i className="pi pi-home"></i>
                                    <div className="flex flex-row align-items-center justify-content-center ml-2">
                                        Retornar
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}