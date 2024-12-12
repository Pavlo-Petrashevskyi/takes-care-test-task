'use client'

import { capitalizeFirstLetterAndRemoveDash } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function PagesTitle() {
  const pathname = usePathname();

  return (
    <div 
      className="mt-[8px] font-light text-[40px] text-[#112950] leading-[48px]"
    >
      {pathname === '/' 
        ? 'Strona głowna'
        : capitalizeFirstLetterAndRemoveDash(pathname ? pathname.split('/').slice(-1)[0] : '')}
    </div>
  );
}