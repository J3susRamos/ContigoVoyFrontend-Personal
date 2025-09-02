
function useWhatsAppServices() {

    const aceptarCitaMessage = async (celular: string, comentario: string) => {
      console.log(`PROCESO EN: ${process.env.NEXT_PUBLIC_API_WHATSAPP_URL}/api/send-message-accept`)

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_WHATSAPP_URL}/api/send-message-accept`, {
                method: "POST",
                
                body: JSON.stringify({
                  telefono: celular,
                  comentario: comentario
                }),
              });
        
              if (!response.ok) {
                throw new Error("Error al enviar mensaje de boucher aceptado");
              }
              
            } catch (error) {
              console.log("Error al enviar mensaje:", error);
            } 
    };
  
    const rechazarCitaMessage = async (celular: string, comentario: string) => {

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_WHATSAPP_URL}/api/send-message-reject`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  telefono:celular,
                  comentario: comentario
                }),
              });
        
              if (!response.ok) {
                throw new Error("Error al enviar mensaje de boucher rechazado");
              }
              
            } catch (error) {
              console.error("Error al enviar mensaje:", error);
            } 
    };
  
    return {
      aceptarCitaMessage,
      rechazarCitaMessage,
    };
}

export default useWhatsAppServices