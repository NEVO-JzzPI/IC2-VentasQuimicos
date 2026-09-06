const typeStyles = {
  info: 'bg-secundario text-letra border-letra-secundario/30',
  entradas: 'bg-checkboxtrueorinpt text-white border-transparent',
  salidas: 'bg-botonprincipal text-white border-transparent',
}

export default function Toast({ message, type = 'info' }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-lg border px-4 py-3 shadow-lg font-principal text-sm ${typeStyles[type]}`}
      >
      <span>{message}</span>
      
    </div>
  )
}
