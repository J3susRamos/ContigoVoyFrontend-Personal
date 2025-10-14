"use client";
import { useParams } from "next/navigation";

export default function UserRoleDetail() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Detalle del usuario</h1>
      <p>ID recibido en la URL: {id}</p>
    </div>
  );
}
// cambio
