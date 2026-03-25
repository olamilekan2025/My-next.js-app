'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Package } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center p-8 text-center bg-gray-50">
      <div className="max-w-md mx-auto">
       
        <div className="text-8xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
          404
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved to another dimension. 
        </p>
        <Button asChild size="lg" className="gap-3 text-lg px-8 h-12 group hover:bg-blue-500">
          <Link href="/" className="flex items-center">
            <Home className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </Button>
      </div>
    </main>
  );
}
