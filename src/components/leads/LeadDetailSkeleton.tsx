
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LeadDetailSkeleton: React.FC = () => {
  return (
    <div className="container py-6">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-32 ml-auto" />
      </div>
    </div>
  );
};

export default LeadDetailSkeleton;
