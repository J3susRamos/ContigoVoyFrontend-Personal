import { Icons } from "@/icons";
import React from "react";

const redes = [
  {
    nombre: "tiktok",
    icono: Icons.tiktok,
    alt: "tiktok Terapia Psicológica Contigo Voy",
    link: "https://www.tiktok.com/@centropsico_contigovoy",
  },
  {
    nombre: "threads",
    icono: Icons.threads,
    alt: "threads Terapia Psicológica Contigo Voy",
    link: "https://www.threads.net/@centropsicologico_contigovoy?xmt=AQGzhgUl3zE052rR0Uo6GYSGAMvTqFrOObja-kBjKoMA7A",
  },
  {
    nombre: "instagram",
    icono: Icons.instagram,
    alt: "instagram Terapia Psicológica Contigo Voy",
    link: "https://www.instagram.com/centropsicologico_contigovoy?igsh=MXc2aTQ3ZGk4OXg5bQ==",
  },
  {
    nombre: "facebook",
    icono: Icons.facebook,
    alt: "facebook Terapia Psicológica Contigo Voy",
    link: "https://www.facebook.com/centropsicologico.contigovoy",
  },
  {
    nombre: "youtube",
    icono: Icons.youtube,
    alt: "youtube Terapia Psicológica Contigo Voy",
    link: "https://youtube.com/@centropsicologico-contigovoy?feature=shared",
  },
  
];

const RedesSociales = () => {
  return (
    <div>
      <ul className="wrapper flex space-x-2 items-center">
        {redes.map((rede, index) => (
          <li
          className={`icon ${rede.nombre} fill-current text-[#634AE2]`}
            key={index}
            onClick={() => window.open(rede.link, "_blank")}
          >
            <span className="tooltip capitalize">{rede.nombre}</span>
            <div
              role="img"
              aria-label= {rede.alt}
              className="icon-svg"
              dangerouslySetInnerHTML={{ __html: rede.icono }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RedesSociales;
