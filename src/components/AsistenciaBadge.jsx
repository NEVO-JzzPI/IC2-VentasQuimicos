const estilos ={
    'Presente': 'bg-checkboxtrueorinpt text-white',
    'Ausente': 'bg-botonprincipal text-white',
    'S. Anticipada': 'bg-letra-secundario text-white',
}

export default function AsistenciaBadge({ estado }){

    const clase = estilos[estado] ?? 'bg-letra-secundario text-white';
    return(
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-rotulo uppercase tracking-wide font-semibold ${clase}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
            {estado}
        </span>
    )
}