// Mock de reportes de asistencia — simula la futura API Django (delay 500ms).
// Reemplazar por llamadas reales cuando el backend esté listo, sin tocar Reporte.jsx.

const atrasos = [
    { id: 1, nombre: 'Juan Pérez', cargo: 'Operario', hora: '08:23' },
    { id: 2, nombre: 'Ana Torres', cargo: 'Vendedora', hora: '08:41' },
];

const inasistencias = [
    { id: 1, nombre: 'María Gómez', cargo: 'Supervisora', fecha: '2026-09-11' },
    { id: 2, nombre: 'Pedro Soto', cargo: 'Bodeguero', fecha: '2026-09-12' },
];

const salidasAnticipadas = [
    { id: 1, nombre: 'Carlos Ruiz', cargo: 'Bodeguero', hora: '16:10' },
];

const reportes = {
    atrasos: { titulo: 'Reporte de Atrasos', columnaExtra: 'Hora de llegada', data: atrasos, campo: 'hora' },
    inasistencias: { titulo: 'Reporte de Inasistencia', columnaExtra: 'Fecha', data: inasistencias, campo: 'fecha' },
    'salidas-anticipadas': { titulo: 'Reporte de Salidas Anticipadas', columnaExtra: 'Hora de salida', data: salidasAnticipadas, campo: 'hora' },
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
