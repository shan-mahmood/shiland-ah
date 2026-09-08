import { Suspense } from 'react';
import RateClient from './RateClient';

// useSearchParams() requires a Suspense boundary in the App Router.
export default function RatePage() {
  return (
    <Suspense fallback={<div className="page" />}>
      <RateClient />
    </Suspense>
  );
}
