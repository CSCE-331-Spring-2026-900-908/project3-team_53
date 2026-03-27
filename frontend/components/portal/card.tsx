import Link from 'next/link';
import React, { ReactNode } from 'react';

type CardProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export default function Card({ href, children, className = '' }: CardProps) {
  return (
    <Link
      href={href}
      className={`block w-80 rounded-xl bg-[#f5f0dc] p-6 shadow-md transition-transform hover:scale-[1.02] ${className}`}
    >
      {children}
    </Link>
  );
}
