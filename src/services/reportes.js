// Mock de reportes de asistencia — simula la futura API Django (delay 500ms).
// Reemplazar por llamadas reales cuando el backend esté listo, sin tocar Reporte.jsx.

const atrasos = [
    { id: 1, nombre: 'Juan Pérez', cargo: 'Operario', hora: '09:47', fecha: '2026-09-11' },
    { id: 2, nombre: 'Ana Torres', cargo: 'Vendedora', hora: '10:05', fecha: '2026-09-12' },
];

const inasistencias = [
    { id: 1, nombre: 'María Gómez', cargo: 'Supervisora', fecha: '2026-09-11' },
    { id: 2, nombre: 'Pedro Soto', cargo: 'Bodeguero', fecha: '2026-09-12' },
];

const salidasAnticipadas = [
    { id: 1, nombre: 'Carlos Ruiz', cargo: 'Bodeguero', hora: '16:10', fecha: '2026-09-11' },
];

const reportes = {
    atrasos: {
        titulo: 'Reporte de Atrasos',
        data: atrasos,
        columnas: [
            { label: 'Hora de llegada', campo: 'hora' },
            { label: 'Fecha', campo: 'fecha' },
        ],
    },
    inasistencias: {
        titulo: 'Reporte de Inasistencia',
        data: inasistencias,
        columnas: [
            { label: 'Fecha', campo: 'fecha' },
        ],
    },
    'salidas-anticipadas': {
        titulo: 'Reporte de Salidas Anticipadas',
        data: salidasAnticipadas,
        columnas: [
            { label: 'Hora de salida', campo: 'hora' },
            { label: 'Fecha', campo: 'fecha' },
        ],
    },
};

export function ListReporte(tipo) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const reporte = reportes[tipo];
            if (!reporte) {
                reject(new Error('Tipo de reporte no encontrado'));
                return;
            }
            resolve(reporte);
        }, 500);
    });
}
