'use client';

import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export const useAuthRoutes = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  useEffect(() => {
    // Verifica si la cookie 'session' existe
    const cookies = parseCookies();
    const session = cookies.session;

    if (!session) {
      redirect('/auth/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  return { isLoading }; 
};