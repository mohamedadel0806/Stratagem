import { Suspense } from 'react';
import { InfluencersPageContent } from './influencers-content';

// Force dynamic rendering - this page requires runtime data and cannot be statically generated
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function InfluencersPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <InfluencersPageContent />
    </Suspense>
  );
}
