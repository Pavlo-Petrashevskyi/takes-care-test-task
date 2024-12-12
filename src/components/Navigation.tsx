'use client';

import Link from "next/link";
import Image from "next/image";
import takesCareLogo from '../../public/TC-logo.png';
import { Bug, CalendarPlus2, Globe } from 'lucide-react'
import ButtonTopNav from "./ButtonTopNav";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SetStateAction, useState } from 'react';

const Navigation = () => {
  const [lang, setLang] = useState('PL');

  return (
    <nav
      className="flex py-[24px] px-[64px] justify-between bg-[#FEFEFE] border-b-[1px] border-[#E4E5E7] sticky top-0 z-10"
    >
      <Link href={'/'}>
        <Image 
          src={takesCareLogo}
          alt="TakesCare Logo"
          width={191}
          height={48}
        />
      </Link>

      <div
        className="flex gap-[24px]"
      >
        {/* fix buttons tab */}
        <ButtonTopNav
          additionalClasses="w-[182px] border border-[#FF3414] transition-all duration-300 hover:opacity-70"
        >
          <Link
            href={'/support'}
            className="flex w-full h-full gap-[8px] items-center "
          >
            <Bug size={16} color="#D61C00" />
            <p
              className="text-[#D61C00]"
            >
              Zgłoś problem
            </p>
          </Link>
        </ButtonTopNav>

        <ButtonTopNav
          additionalClasses="w-[176px] bg-[#0068FA] transition-all duration-300 hover:opacity-70"
        >
          <Link
            href={'/wizyty-domowe/umawianie-wizyty'}
            className="flex w-full h-full  gap-[8px] items-center "
          >
            <CalendarPlus2 size={16} color="#FEFEFE" />
            <p
              className="text-[#FEFEFE]"
            >
              Umów wizytę
            </p>
          </Link>
        </ButtonTopNav>

        <div className="flex items-center">
          <Select 
            defaultValue={lang}
            onValueChange={(value: SetStateAction<string>) => setLang(value)}
          >
            <SelectTrigger 
              className="w-max flex gap-[8px] items-center leading-[100%] border-none text-[#0068FA] px-[0px] focus:ring-0 focus:ring-transparent"
            >
              <Globe size={16} color="#0068FA" />
              <SelectValue placeholder="PL"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PL">PL</SelectItem>
              <SelectItem value="UA">UA</SelectItem>
              <SelectItem value="DE">DE</SelectItem>
              <SelectItem value="EN">EN</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;