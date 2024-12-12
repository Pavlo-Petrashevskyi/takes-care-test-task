import React from 'react';

type ButtonTopNavProps = {
  additionalClasses: string,
  children?: React.ReactNode,
}

export default function ButtonTopNav({
  additionalClasses,
  children,
}: ButtonTopNavProps) {
  return (
    <button 
      className={`h-[48px] px-[24px] py-[12px] rounded-[8px] font-medium text-[14px] leading-[24px] ${additionalClasses}`} 
    >
      {children}
    </button>
  )
}