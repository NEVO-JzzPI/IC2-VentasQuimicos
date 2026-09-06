
export default function Card({children, className = '', ...props}) {

    return(
            <div className={`bg-secundario w-full max-w-md rounded-2xl  p-8 shadow-lg font-principal text-letra space-y-6 ${className}`} {...props}>
                {children}
            </div>
    )


}