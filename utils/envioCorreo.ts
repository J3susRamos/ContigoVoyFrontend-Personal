/*"use server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Usa el servicio de tu preferencia (Ejemplo: Gmail, Outlook, etc.)
  auth: {
    user: "contigovoyproject@gmail.com", // Tu dirección de correo
    pass: "osgmdssgssdwrcnc", // Tu contraseña de correo o app password
  },
});

const sendMail = async (
  email: string,
  subject: string,
  text: string,
  nombre: string,
  apellido: string,
  telefono: string
) => {
  const html = crearContenidoHTML(nombre, apellido, email, text, telefono);
  const mensajeEmail = crearMensaje(email, "Formulario de Contacto", html);
  mensajeEmail.html = html;

  try {
    await transporter.sendMail(mensajeEmail);
    console.log("Correo enviado con éxito");
    return true;
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return false;
  }
};
const crearMensaje = (
  destinatario: string,
  asunto: string,
  contenidoHTML: string
) => {
  return {
    from: destinatario,
    to: "contigovoyproject@gmail.com",
    subject: asunto,
    html: contenidoHTML, // Asegúrate de especificar que el contenido es HTML
  };
};
const crearContenidoHTML = (
  nombre: string,
  apellido: string,
  email: string,
  mensaje: string,
  telefono: string
) => {
  return `
      <html>
          <head>
              <title>Formulario de Contacto</title>
          </head>
          <body>
              <h1>Formulario de Contacto</h1>
              <p>Nombre: ${nombre} ${apellido}</p>
              <p>Email: ${email}</p>
              <p>Mensaje: ${mensaje}</p>
              <p>Telefono:${telefono}</p>
          </body>
      </html>
    `;
};

export default sendMail;
*/