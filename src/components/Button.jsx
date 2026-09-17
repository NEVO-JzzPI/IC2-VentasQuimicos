export default function Button({ children, type = 'button', className = '', ...props }) {
  return (
    <button
      type={type}
      className={`w-full rounded-md bg-botonprincipal py-2.5 font-rotulo font-semibold uppercase tracking-wider text-white transition hover:bg-botonhover active:translate-y-px focus:outline-none focus:ring-4 focus:bg-botonhover focus:ring-botonprincipal/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}