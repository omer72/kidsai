import type { ReactNode } from 'react';
import Link from 'next/link';

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        background: '#F7F8FB',
        color: '#0B1D3A',
        fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
      }}
    >
      <main
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '48px 24px 96px',
          lineHeight: 1.65,
          fontSize: 16,
        }}
      >
        <nav style={{ marginBottom: 32, fontSize: 14 }}>
          <Link href="/" style={{ color: '#2E5BFF', textDecoration: 'none' }}>
            ← Kidai
          </Link>
        </nav>

        <h1
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontWeight: 500,
            fontSize: 36,
            lineHeight: 1.15,
            margin: '0 0 8px',
            color: '#0B1D3A',
          }}
        >
          {title}
        </h1>
        <p style={{ color: '#8591AD', fontSize: 14, margin: '0 0 32px' }}>
          Last updated: {lastUpdated}
        </p>

        <article className="legal-body">{children}</article>

        <footer style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid #DDE3EF', fontSize: 13, color: '#8591AD' }}>
          <Link href="/privacy" style={{ color: '#2E5BFF', textDecoration: 'none', marginRight: 16 }}>
            Privacy
          </Link>
          <Link href="/terms" style={{ color: '#2E5BFF', textDecoration: 'none' }}>
            Terms
          </Link>
        </footer>
      </main>

      <style>{`
        .legal-body h2 {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 500;
          font-size: 22px;
          line-height: 1.25;
          margin: 36px 0 12px;
          color: #0B1D3A;
        }
        .legal-body h3 {
          font-weight: 600;
          font-size: 16px;
          margin: 24px 0 8px;
          color: #0B1D3A;
        }
        .legal-body p { margin: 0 0 14px; color: #415075; }
        .legal-body ul { margin: 0 0 16px; padding-left: 22px; color: #415075; }
        .legal-body li { margin: 0 0 8px; }
        .legal-body a { color: #2E5BFF; text-decoration: underline; }
        .legal-body strong { color: #0B1D3A; font-weight: 600; }
      `}</style>
    </div>
  );
}
