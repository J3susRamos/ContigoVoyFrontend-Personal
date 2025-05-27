import ChooseUs from "@/components/mainPage/chooseUs";
import OnlinePsychology from "@/components/mainPage/onlinePsychology";
import TherapyServices from "@/components/mainPage/therapyServices";
import MainSlider from "@/components/mainPage/mainslider";
import RealiableCompanies from "@/components/mainPage/ReliableCompanies";

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      <MainSlider />
      <TherapyServices />
      <ChooseUs />
      <RealiableCompanies />
      <OnlinePsychology />
    </div>
  );
}
