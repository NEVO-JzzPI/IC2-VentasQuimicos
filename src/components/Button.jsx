export default function Button({ children, type = 'button', className = '', ...props }) {
  return (
    <button
      type={type}
      className={`w-full rounded-lg bg-botonprincipal py-2.5 font-semibold text-white transition hover:bg-botonhover focus:outline-none focus:ring-4 focus:bg-botonhover focus:ring-botonprincipal/20 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}