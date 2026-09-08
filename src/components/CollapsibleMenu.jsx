import { useState } from "react"

export default function CollapsibleMenu({title, items}){

    const[open,setOpen]= useState(false);
    return(

        <div>
            <button
                onClick={()=>{setOpen(!open)}}
                className="flex justify-between items-center w-full text-letra font-principal"
            >
                {title}
                <span>{open ? '▾' : '▸'}</span>
            </button>
            {open && (
                <ul className="mt-2 ml-2 space-y-1 text-letra-secundario">
                    {items.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            )}
        
        </div>
    )

}

