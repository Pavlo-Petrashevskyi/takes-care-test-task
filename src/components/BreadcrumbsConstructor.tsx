'use client';

import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation";
import React from 'react';
import { ChevronRight } from "lucide-react";
import { capitalizeFirstLetterAndRemoveDash } from "@/lib/utils";

export default function BreadcrumbsConstructor() {
  const pathname = usePathname() || '';
  const arrOfPaths = pathname.split('/').filter(path => path.length > 0)

  return (
    <Breadcrumb>
      <BreadcrumbList className="sm:gap-[8px]">
        {pathname === '/' && (
          <BreadcrumbItem>
            <BreadcrumbPage>
              Home
            </BreadcrumbPage>
          </BreadcrumbItem>
        )}
        
        {arrOfPaths.length === 1 && arrOfPaths.map((path) => (
          <React.Fragment key={path}>
            <BreadcrumbItem>
              <Link href={'/'}>
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight size={12} color="#6D7178"/>
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[#242628]">{capitalizeFirstLetterAndRemoveDash(path)}</BreadcrumbPage>
            </BreadcrumbItem>
          </React.Fragment>
        ))}

        {arrOfPaths.length > 1 && arrOfPaths.map((path, i) => (
          <React.Fragment key={path}>
            <BreadcrumbItem>
            {i !== arrOfPaths.length - 1 
              ? (
                <Link href={`/${path}`} className="">{capitalizeFirstLetterAndRemoveDash(path)}</Link>
              )
              : (
                <BreadcrumbPage className="text-[#242628]">{capitalizeFirstLetterAndRemoveDash(path)}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {i !== arrOfPaths.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight size={12} color="#6D7178"/>
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
