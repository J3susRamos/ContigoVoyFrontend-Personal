import React from 'react'

function Prueba({ data }: {data: number}) {
    console.log("Desde aqui el componente", data)
  return (
    <div>Total de citas: {data}
    </div>
  )
}

export default Prueba