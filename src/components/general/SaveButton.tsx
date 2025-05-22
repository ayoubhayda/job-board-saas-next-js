"use client";
import React from 'react'
import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';
import { Heart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const SaveButton = ({ savedJob }: { savedJob: boolean }) => {
  const { pending } = useFormStatus();

  return (
    <Button variant="outline" type="submit" className='shadow-none cursor-pointer' disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <Heart
            className={cn(
              savedJob ? "fill-current text-red-500" : "",
              "size-4 transition-colors"
            )}
          />
          {savedJob ? "Saved" : "Save Job"}
        </>
      )}
    </Button>
  );
}

export default SaveButton