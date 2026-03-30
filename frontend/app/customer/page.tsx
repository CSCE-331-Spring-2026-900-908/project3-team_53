'use client';

import dynamic from 'next/dynamic';

const CustomerKiosk = dynamic(() => import('@/components/customer/CustomerKiosk'), {
  ssr: false,
});

export default function Page() {
  return <CustomerKiosk />;
}
