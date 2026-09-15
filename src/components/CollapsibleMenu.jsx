import { useState } from "react"
import { NavLink } from "react-router-dom"

export default function CollapsibleMenu({title, items}){

    const[open,setOpen]= useState(false);
    return(

        <div className="relative">
            <button
                onClick={()=>{setOpen(!open)}}
                className="flex items-center gap-2 font-rotulo text-sm uppercase tracking-wide text-letra-secundario transition-colors hover:text-letra"
            >
                {title}
                <span className="text-acento-hazard">{open ? '▾' : '▸'}</span>
            </button>
            {open && (
                <ul className="absolute mt-2 min-w-max space-y-1 rounded-md border border-letra/10 bg-secundario p-3 text-letra-secundario shadow-lg z-10">
                    {items.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `block font-principal text-sm ${isActive ? 'text-botonprincipal font-semibold' : ''}`
                                }
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    )

}

