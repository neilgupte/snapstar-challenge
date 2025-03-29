
import React from 'react';
import { Check } from 'lucide-react';

interface EmptyTabContentProps {
  title: string;
  message: string;
}

const EmptyTabContent: React.FC<EmptyTabContentProps> = ({ title, message }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 rounded-lg border p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Check className="h-6 w-6 text-snapstar-green" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">All Clear</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default EmptyTabContent;
