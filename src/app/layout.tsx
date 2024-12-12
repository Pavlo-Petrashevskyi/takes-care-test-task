import { Inter } from "next/font/google";
import "../styles/global.css";
import Navigation from "@/components/Navigation";
import { AppSidebarLeft } from "@/components/AppSidebarLeft";
import { SidebarProvider } from "@/components/ui/sidebar";
import Image from "next/image";
import takesCareLogo from '../../public/TC-logo.png';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth h-[100%] bg-[#F7F7F8]`}>
      <body>
        <Navigation />

        <div className="mx-[auto] relative w-[1240px] grid grid-cols-[295px_925px] gap-x-[20px]">
          <div className="[@media(max-height:1023px)]:mt-[40px] [@media(min-height:1024px)]:fixed [@media(min-height:1024px)]:top-[137px] col-start-1 col-end-2 [@media(max-height:1023px)]:flex [@media(max-height:1023px)]:flex-col [@media(max-height:1023px)]:justify-between">
            <SidebarProvider className="min-h-0">
              <AppSidebarLeft />
            </SidebarProvider>

            <div className="mb-[40px] mt-[82px] flex flex-col gap-[8px]">
              <a href="#" className="w-[126px] h-[31px]">
                <Image
                  src={takesCareLogo}
                  alt="TakesCare logo bottom"
                  width={126}
                  height={31}
                />
              </a>

              <span className="text-[#6D7178] text-[14px] font-normal leading-[19.6px]">
                © 
                &nbsp;
                <a 
                  href="https://www.takes-care.com/" 
                  target="_blank"
                  className="hover:cursor-pointer"
                > 
                  www.takes-care.com
                </a>
                &nbsp;
                2024
              </span>
            </div>
          </div>

          <main className="w-full h-max mt-[40px] col-start-2 col-end-3">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
