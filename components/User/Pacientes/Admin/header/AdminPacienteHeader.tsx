import CerrarSesion from '@/components/CerrarSesion'
import React from 'react'

export default function AdminPacienteHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between">
      <div className="m-5">
        <h1 className="text-2xl md:text-4xl font-bold text-primary dark:text-primary-foreground">
          Gestión de Pacientes 
        </h1>
        <p className="text-base md:text-xl font-normal text-primary dark:text-primary-foreground mt-2">
          Administra a los pacientes.
        </p>
      </div>
      <div className="m-5">
        <CerrarSesion />
      </div>
    </div>
  )
}
