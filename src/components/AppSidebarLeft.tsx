'use client'

import * as React from 'react'
import AvatarImg from '../../public/avatar.svg'
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { BriefcaseMedical, CalendarDays, ChartNoAxesCombined, CircleHelp, Headset, Hospital, House, Layers2, LogOut, NotebookTabs, Settings } from "lucide-react"

const data = {
  navMain: [
    {
      title: "Główne",
      items: [
        {
          title: "Strona główna",
          url: "/",
          icon: House,
        },
        {
          title: "Wizyty online",
          url: "/wizyty-online/umawianie-wizyty",
          icon: Headset,
        },
        {
          title: "Wizyty domowe",
          url: "/wizyty-domowe/umawianie-wizyty",
          icon: BriefcaseMedical,
        },        
        {
          title: "Wizyty stacjonarne",
          url: "/wizyty-stacjonarne/umawianie-wizyty",
          icon: Hospital
        },        
        {
          title: "Druga opinia",
          url: "/druga-opinia",
          icon: Layers2
        },
        {
          title: "Dziennik aktywności",
          url: "/dziennik-aktywnosci",
          icon: NotebookTabs
        },
        {
          title: "Kalendarz specjalistów",
          url: "/kalendarz-specjalistow",
          icon: CalendarDays,
        },
        {
          title: "Raporty",
          url: "/Raporty",
          icon: ChartNoAxesCombined,
        }
      ],
    },
    {
      title: "Wsparcie i ustawienia",
      items: [
        {
          title: "Ustawienia",
          url: "/ustawienia",
          icon: Settings,
        },
        {
          title: "FAG",
          url: "/fag",
          icon: CircleHelp,
        },
      ],
    },
    {
      title: "Wylogowanie",
      items: [
        {
          title: "Wyloguj się",
          url: "/wyloguj-sie",
          icon: LogOut,
        },
      ],
    },
  ],
}

export function AppSidebarLeft({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = React.useState('');

  return (
    <Sidebar {...props} className="w-[295px] h-max rounded-[8px] static">
      <SidebarHeader className="flex flex-col gap-[8px] items-start rounded-t-[8px] p-[24px] bg-[#FEFEFE]">
        <Image
          src={AvatarImg}
          alt='Avatar image'
          width={80}
          height={80}
        />

        <div className="flex flex-col">
          <span className="font-bold text-[18px] leading-[27px] text-[#1A3F7A]">Imię Nazwisko</span>
          <span className="font-normal text-[16px] leading-[24px] text-[#6D7178]">Operator</span>
          <span className="font-normal text-[16px] leading-[24px] text-[#6D7178]">name@gmail.com</span>
        </div>
      </SidebarHeader>
      <SidebarSeparator className="mx-[24px]"/>
      <SidebarContent className="px-[24px] pb-[8px] rounded-b-[8px] bg-[#FEFEFE] gap-0">
        {data.navMain.map((item, i) => (
          <React.Fragment key={item.title}>
            <SidebarGroup className="p-0">
              <SidebarGroupContent className="py-[16px]">
                <SidebarMenu className="gap-[16px]">
                  {item.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className="data-[active=true]:text-[#0068FA] hover:text-[#0068FA]"
                        isActive={pathname === item.url}
                        onMouseEnter={() => setIsHovered(item.title)}
                        onMouseLeave={() => setIsHovered('')}
                      >
                        <a 
                          href={item.url} 
                          className="flex items-center gap-[8px] h-[24px] p-0 text-[#242628] font-medium text-[16px] leading-[24px] data-[active=true]:bg-transparent active:bg-transparent hover:bg-transparent transition-all duration-300"
                        >
                          {<item.icon 
                            size={24} 
                            color={(pathname === item.url || isHovered === item.title) ? '#0068FA' : '#242628'}
                          />}
                          {item.title}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {i !== data.navMain.length - 1 && <SidebarSeparator className="m-0 px-24px"/>}
          </React.Fragment>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
