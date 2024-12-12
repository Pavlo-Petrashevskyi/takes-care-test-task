import BreadcrumbsConstructor from "@/components/BreadcrumbsConstructor";
import PagesTitle from "@/components/PagesTitle";
import { Settings } from "lucide-react";

export default function Page() {
  return (
    <>
      <BreadcrumbsConstructor />
      <PagesTitle />

      <div className="flex items-center justify-start mt-[40px] p-[20px] h-[80px] w-full bg-[#FEFEFE] rounded-[8px]">
        <span className="flex">
          Przepraszamy, ale strona jest w naprawie 
          &nbsp;
          <Settings size={24} color="#242628"/>
        </span>
      </div>
    </>
  )
}