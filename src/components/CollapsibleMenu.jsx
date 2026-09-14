import { useState } from "react"
import { NavLink } from "react-router-dom"

export default function CollapsibleMenu({title, items}){

    const[open,setOpen]= useState(false);
    return(

        <div className="relative">
            <button
                onClick={()=>{setOpen(!open)}}
                className="flex items-center gap-2 text-secundario font-principal"
            >
                {title}
                <span>{open ? '▾' : '▸'}</span>
            </button>
            {open && (
                <ul className="absolute mt-2 min-w-max space-y-1 rounded-lg bg-secundario p-3 text-letra-secundario shadow-lg z-10">
                    {items.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `block ${isActive ? 'text-botonprincipal font-bold' : ''}`
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

