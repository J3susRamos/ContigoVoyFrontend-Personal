import PersonalComponent from "@/components/CrearUsuario/PersonalComponent";

export default function Personal() {
  return(
    <div className="flex justify-center items-center h-screen"
    style={{
      backgroundImage: `linear-gradient(to right, #3616D87A 0%, #3616D870 30%, #7863E37A 70%, #7863E370 100%)`,
     }}
    >
    <PersonalComponent />    
  </div>
  )
}
