import { Construction } from 'lucide-react';
import Link from 'next/link';
import { C, FONTS } from '@/lib/design';

interface PlaceholderProps {
  title: string;
  description: string;
}

export default function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-10 py-8">
      <div
        className="rounded-3xl p-12 max-w-lg text-center"
        style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
      >
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5"
          style={{ backgroundColor: C.bone }}
        >
          <Construction size={22} style={{ color: C.inkSoft }} />
        </div>
        <h1
          className="text-[28px] tracking-tight mb-2"
          style={{ color: C.ink, fontFamily: FONTS.serif, fontStyle: 'italic' }}
        >
          {title}
        </h1>
        <p
          className="text-[14px] leading-relaxed mb-6"
          style={{ color: C.muted, fontFamily: FONTS.sans }}
        >
          {description}
        </p>
        <Link
          href="/prototype"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full transition-colors"
          style={{
            backgroundColor: C.ink,
            color: C.cream,
            fontFamily: FONTS.sans,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          See it in the mobile prototype
        </Link>
      </div>
    </div>
  );
}
