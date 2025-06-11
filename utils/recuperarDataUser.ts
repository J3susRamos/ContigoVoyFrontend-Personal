import { UserInterface } from "@/interface";
//import { supabase } from "@/lib/supabaseClient";

type SetUserFunction = (user: UserInterface) => void;
export const fetchUser = async (setUser: SetUserFunction) => {
 /* const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error.message);
    return; // Salir si hay un error
  }
*
  const { user } = data || {};
  const name = user?.user_metadata?.name || "Usuario";
  const email = user?.user_metadata?.email || "usuario@gmail.com";
  const lastname = user?.user_metadata?.lastname || "";
  const photo = user?.user_metadata?.photo || "";
  const iniciales =
    name.charAt(0).toUpperCase() + lastname.charAt(0).toUpperCase();
  setUser({ name, email, lastname, photo, iniciales });*/
};
