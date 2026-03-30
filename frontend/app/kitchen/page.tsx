'use client';

import dynamic from 'next/dynamic';

const KitchenPage = dynamic(() => import('@/components/kitchen/KitchenDisplay'), {
  ssr: false,
});

export default function Page() {
  return <KitchenPage />;
}
