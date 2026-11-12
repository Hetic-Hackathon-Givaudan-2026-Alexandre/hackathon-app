import Link from 'next/link';

export default function Introuvable() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <h1 className="text-4xl font-normal">Cette tendance n&apos;existe pas</h1>
      <p className="mt-3 text-brume">
        Elle a peut-être été retirée du suivi.{' '}
        <Link href="/" className="text-texte underline">
          Revenir au fil du jour
        </Link>
      </p>
    </main>
  );
}
