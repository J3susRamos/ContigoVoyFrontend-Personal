import { destroyCookie, setCookie } from "nookies";
import { useState } from "react";
import { UsuarioLocalStorage } from "@/interface"; 

interface AuthState {
  user: UsuarioLocalStorage | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    loading: false,
    error: null,
  });

  const login = async (email: string, password: string) => {
    setAuthState({ ...authState, loading: true });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/auth/login`,

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.message || "Error en el inicio de sesión";
        setAuthState({ ...authState, loading: false, error: errorMessage });
        return;
      }

      const token = data.result.token.split("|")[1];

      setCookie(null, "session", token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      const userDataToStore = data.user || {
        id: data.result.id,
        email: data.result.email,
        rol: data.result.rol,
        nombre: data.result.nombre,
        apellido: data.result.apellido,
        imagen: data.result.imagen,
        ...(data.result.idpsicologo && { idpsicologo: data.result.idpsicologo }),
        permisos: data.result.permissions,
      };

      localStorage.setItem("user", JSON.stringify(userDataToStore));

      setAuthState({
        user: userDataToStore,
        token: token,
        loading: false,
        error: null,
      });
      //Redirigir al dashboard
      window.location.assign("/user/home");

    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Se produjo un error desconocido";

      setAuthState({ ...authState, loading: false, error: errorMessage });
    }
  };

  const logout = () => {
    destroyCookie(null, "session", { path: "/" });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch(error => {
      console.error("Error during logout:", error);
    });

    localStorage.removeItem("user");

    window.location.assign("/login");
  };
  return { ...authState, login, logout };
};
