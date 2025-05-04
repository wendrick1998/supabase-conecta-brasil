
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PipelineSkeleton: React.FC = () => {
  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="mt-4 md:mt-0">
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4].map((col) => (
          <div key={col} className="bg-gray-50 rounded-lg p-4">
            <Skeleton className="h-5 w-40 mb-4" />
            
            {[1, 2, 3].map((card) => (
              <div key={card} className="mb-3">
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineSkeleton;
