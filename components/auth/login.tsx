import { Input } from "@heroui/react";
import React, { useState } from "react";
import { useAuth } from "@/components/auth/loginsec";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/Themetoggle";
import { motion } from "framer-motion";
import Image from "next/image";

export const EyeSlashFilledIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      {" "}
      <path
        d="M21.2714 9.17834C20.9814 8.71834 20.6714 8.28834 20.3514 7.88834C19.9814 7.41834 19.2814 7.37834 18.8614 7.79834L15.8614 10.7983C16.0814 11.4583 16.1214 12.2183 15.9214 13.0083C15.5714 14.4183 14.4314 15.5583 13.0214 15.9083C12.2314 16.1083 11.4714 16.0683 10.8114 15.8483C10.8114 15.8483 9.38141 17.2783 8.35141 18.3083C7.85141 18.8083 8.01141 19.6883 8.68141 19.9483C9.75141 20.3583 10.8614 20.5683 12.0014 20.5683C13.7814 20.5683 15.5114 20.0483 17.0914 19.0783C18.7014 18.0783 20.1514 16.6083 21.3214 14.7383C22.2714 13.2283 22.2214 10.6883 21.2714 9.17834Z"
        fill="currentColor"
      />
      <path
        d="M14.0206 9.98062L9.98062 14.0206C9.47062 13.5006 9.14062 12.7806 9.14062 12.0006C9.14062 10.4306 10.4206 9.14062 12.0006 9.14062C12.7806 9.14062 13.5006 9.47062 14.0206 9.98062Z"
        fill="currentColor"
      />
      <path
        d="M18.25 5.74969L14.86 9.13969C14.13 8.39969 13.12 7.95969 12 7.95969C9.76 7.95969 7.96 9.76969 7.96 11.9997C7.96 13.1197 8.41 14.1297 9.14 14.8597L5.76 18.2497H5.75C4.64 17.3497 3.62 16.1997 2.75 14.8397C1.75 13.2697 1.75 10.7197 2.75 9.14969C3.91 7.32969 5.33 5.89969 6.91 4.91969C8.49 3.95969 10.22 3.42969 12 3.42969C14.23 3.42969 16.39 4.24969 18.25 5.74969Z"
        fill="currentColor"
      />
      <path
        d="M14.8581 11.9981C14.8581 13.5681 13.5781 14.8581 11.9981 14.8581C11.9381 14.8581 11.8881 14.8581 11.8281 14.8381L14.8381 11.8281C14.8581 11.8881 14.8581 11.9381 14.8581 11.9981Z"
        fill="currentColor"
      />
      <path
        d="M21.7689 2.22891C21.4689 1.92891 20.9789 1.92891 20.6789 2.22891L2.22891 20.6889C1.92891 20.9889 1.92891 21.4789 2.22891 21.7789C2.37891 21.9189 2.56891 21.9989 2.76891 21.9989C2.96891 21.9989 3.15891 21.9189 3.30891 21.7689L21.7689 3.30891C22.0789 3.00891 22.0789 2.52891 21.7689 2.22891Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const EyeFilledIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      {" "}
      <path
        d="M21.25 9.14969C18.94 5.51969 15.56 3.42969 12 3.42969C10.22 3.42969 8.49 3.94969 6.91 4.91969C5.33 5.89969 3.91 7.32969 2.75 9.14969C1.75 10.7197 1.75 13.2697 2.75 14.8397C5.06 18.4797 8.44 20.5597 12 20.5597C13.78 20.5597 15.51 20.0397 17.09 19.0697C18.67 18.0897 20.09 16.6597 21.25 14.8397C22.25 13.2797 22.25 10.7197 21.25 9.14969ZM12 16.0397C9.76 16.0397 7.96 14.2297 7.96 11.9997C7.96 9.76969 9.76 7.95969 12 7.95969C14.24 7.95969 16.04 9.76969 16.04 11.9997C16.04 14.2297 14.24 16.0397 12 16.0397Z"
        fill="currentColor"
      />
      <path
        d="M11.9984 9.14062C10.4284 9.14062 9.14844 10.4206 9.14844 12.0006C9.14844 13.5706 10.4284 14.8506 11.9984 14.8506C13.5684 14.8506 14.8584 13.5706 14.8584 12.0006C14.8584 10.4306 13.5684 9.14062 11.9984 9.14062Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default function Login() {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const { login, loading, error } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(credentials.email, credentials.password);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e3d7fa] via-[#d1c4e9] to-[#b39ddb] dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 transition-all duration-500">
      {/* Fondo con elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="hidden dark:block absolute top-20 left-20 w-72 h-72 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-pulse"></div>
        <div className="hidden dark:block absolute top-40 right-20 w-96 h-96 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="hidden dark:block absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-purple-100 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-pulse delay-500"></div>
      </div>
      {/* Toggle de tema en la esquina superior derecha */}
      <div className="fixed top-6 right-6 z-10">
        <ThemeToggle />
      </div>{" "}
      {/* Contenedor principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-5xl mx-4 min-h-screen flex items-center justify-center"
      >
        <Card className="backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 shadow-2xl border-2 border-[#c3b6e6] dark:border-[#3a2a5d] border-double rounded-3xl flex items-center justify-center w-full">
          <div className="flex flex-col lg:flex-row w-full items-center justify-center">
            <div
              className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-[#d1c4e9] via-[#b39ddb] to-[#ede9fe] dark:from-[#3a2a5d] dark:via-[#634AE2] dark:to-[#9494F3] opacity-60 z-20"
              style={{ transform: "translateX(-50%)" }}
            ></div>

            <div className="hidden lg:flex lg:w-1/2 bg-transparent items-center justify-center p-8 lg:p-12 relative h-64 lg:h-full overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-32 h-32 bg-[#634AE2]/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#9494F3]/10 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#634AE2]/5 rounded-full blur-lg"></div>
              </div>
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center space-y-4">
                <Image
                  src="/icon0.svg"
                  alt="Logo Contigo Voy"
                  width={200}
                  height={200}
                  className="w-36 h-36 lg:w-48 lg:h-48 object-contain drop-shadow-lg"
                  priority
                />
                <div className="text-center">
                  <h2 className="text-3xl lg:text-5xl font-bold text-[#634AE2] dark:text-[#9494F3] leading-tight">
                    Contigo Voy
                  </h2>
                  <p className="text-xl lg:text-2xl text-[#634AE2]/80 dark:text-[#9494F3]/80 font-medium mt-2">
                    Centro psicológico
                  </p>
                </div>
              </div>
            </div>
            {/* Sección derecha - Formulario */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center items-center h-full"
            >
              <CardHeader className="space-y-6 pb-8 px-0">
                {/* Logo pequeño para móvil */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="flex justify-center lg:hidden"
                >
                  <Image
                    src="/icon0.svg"
                    alt="Logo Contigo Voy"
                    width={60}
                    height={60}
                    className="w-16 h-16"
                    priority
                  />
                </motion.div>

                <CardTitle className="text-center lg:text-left">
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#634AE2] to-[#9494F3] bg-clip-text text-transparent"
                  >
                    Iniciar Sesión
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0, duration: 0.6 }}
                    className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-normal"
                  >
                    Accede a tu panel profesional
                  </motion.p>
                </CardTitle>
              </CardHeader>

              <CardContent className="px-0">
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium text-gray-800 dark:text-gray-300"
                      htmlFor="email"
                    >
                      Correo electrónico
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="tu@email.com"
                      radius="lg"
                      variant="bordered"
                      classNames={{
                        inputWrapper:
                          "border-gray-300 dark:border-gray-600 hover:border-[#634AE2] dark:hover:border-[#9494F3] focus-within:!border-[#634AE2] dark:focus-within:!border-[#9494F3] bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm h-12 shadow-sm",
                        input:
                          "text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-500",
                      }}
                      value={credentials.email}
                      onChange={handleChange}
                      isRequired
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium text-gray-800 dark:text-gray-300"
                      htmlFor="password"
                    >
                      Contraseña
                    </label>
                    <Input
                      id="password"
                      name="password"
                      placeholder="Tu contraseña"
                      isRequired
                      autoComplete="current-password"
                      classNames={{
                        inputWrapper:
                          "border-gray-300 dark:border-gray-600 hover:border-[#634AE2] dark:hover:border-[#9494F3] focus-within:!border-[#634AE2] dark:focus-within:!border-[#9494F3] bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm h-12 shadow-sm",
                        input:
                          "text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-500",
                      }}
                      radius="lg"
                      value={credentials.password}
                      onChange={handleChange}
                      endContent={
                        <button
                          aria-label="toggle password visibility"
                          className="focus:outline-none"
                          type="button"
                          onClick={toggleVisibility}
                        >
                          {isVisible ? (
                            <EyeSlashFilledIcon className="text-2xl text-gray-400 hover:text-[#634AE2] transition-colors" />
                          ) : (
                            <EyeFilledIcon className="text-2xl text-gray-400 hover:text-[#634AE2] transition-colors" />
                          )}
                        </button>
                      }
                      type={isVisible ? "text" : "password"}
                      variant="bordered"
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    >
                      <p className="text-sm text-red-600 dark:text-red-400 text-center">
                        {error}
                      </p>
                    </motion.div>
                  )}

                  <Button
                    disabled={loading}
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#634AE2] to-[#9494F3] hover:from-[#5339d2] hover:to-[#8383f0] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-0"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Iniciando sesión...</span>
                      </div>
                    ) : (
                      "Iniciar sesión"
                    )}
                  </Button>
                </motion.form>

                {/* Información adicional */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6, duration: 0.6 }}
                  className="mt-8 text-center lg:text-left"
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ¿Problemas con tu acceso? Contacta con soporte técnico
                  </p>
                </motion.div>
              </CardContent>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
