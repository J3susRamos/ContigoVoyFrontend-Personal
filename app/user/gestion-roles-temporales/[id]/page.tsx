// app/user/gestion-roles-temporales/[id]/page.tsx
import UserRoleDetail from "./UserRoleDetail";

export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/personal/permissions/ids`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.warn("⚠ No se pudieron obtener los IDs, usando valores por defecto");
      return [{ id: "1" }]; // 👈 fallback
    }

    const data = await res.json();

    if (!Array.isArray(data.result) || data.result.length === 0) {
      console.warn("⚠ API devolvió lista vacía, usando valores por defecto");
      return [{ id: "1" }];
    }

    return data.result.map((item: { id: number | string }) => ({
      id: item.id.toString(),
    }));
  } catch (err) {
    console.error("Error al generar params:", err);
    return [{ id: "1" }]; // 👈 fallback por error
  }
}

export default function Page() {
  return <UserRoleDetail />;
}
// cambio