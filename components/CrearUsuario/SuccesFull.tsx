import { Button } from "@heroui/react";
import Link from "next/link";

export const Suceesfully = ({
    setIsSend,
  }: {
    setIsSend: () => void;  // Cambiado para aceptar una función en lugar de un React. Dispatch
  }) => {
    return (
      <div className="bg-[#634AE2] w-auto rounded-3xl p-20 ">
        <h1 className="font-bold text-4xl text-white py-20 w-full max-w-[500px] text-center">
          Los datos han sido registrados con éxito
        </h1>
        <div className=" gap-10 justify-center flex flex-row mx-auto">
          <Button
            className="bg-inherit border-1 border-white text-white text-sm font-light rounded-full"
            onPress={() => {
              setIsSend(); // Ahora llama a la función resetForm
            }}
          >
            Registrar otro
          </Button>
  
          <Link href={"/user/home/"}>
            <Button className="bg-[#9494F3] text-white text-sm font-light rounded-full">
              Volver al Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  };
