import { Button } from "@heroui/react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const Suceesfully = ({
    setIsSend,
  }: {
    setIsSend: () => void;
  }) => {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 text-center">
          <div className="mb-10">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="font-bold text-2xl md:text-3xl text-gray-900 dark:text-white mb-4">
              ¡Registro Exitoso!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
              Los datos del psicólogo han sido registrados correctamente en el sistema
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              radius="lg"
              variant="bordered"
              size="lg"
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold transition-all duration-200"
              onPress={() => {
                setIsSend();
              }}
            >
              Registrar Otro Psicólogo
            </Button>

            <Link href={"/user/home/"}>
              <Button 
                radius="lg"
                size="lg"
                className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Volver al Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  };
