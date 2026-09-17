
export default function Card({children, className = '', ...props}) {

    return(
            <div className={`bg-secundario w-full max-w-md rounded-lg border border-letra/10 p-8 shadow-[0_1px_3px_rgba(28,28,28,0.08)] font-principal text-letra space-y-6 ${className}`} {...props}>
                {children}
            </div>
    )


}