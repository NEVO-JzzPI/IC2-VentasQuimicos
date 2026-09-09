const estilos ={
    'Presente': 'bg-checkboxtrueorinpt text-white',
    'Ausente': 'bg-botonprincipal text-white',
    'S. Anticipada': 'bg-letra-secundario text-white',
}

export default function AsistenciaBadge({ estado }){

    const clase = estilos[estado] ?? 'bg-letra-secundario text-white';
    return(
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-principal font-semibold ${clase}`}>
            {estado}
        </span>
    )
}