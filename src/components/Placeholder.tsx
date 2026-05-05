import { Construction } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PlaceholderProps {
  title: string;
  description: string;
}

export default function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-10 py-8">
      <Card className="max-w-lg text-center">
        <CardContent className="p-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5 bg-muted">
            <Construction className="size-5 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            {title}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground mb-6">
            {description}
          </p>
          <Button render={<Link href="/prototype" />}>
            See it in the mobile prototype
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
