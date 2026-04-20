import fs from 'fs';
import path from 'path';
import NdaCreator from '@/components/NdaCreator';

export default function Page() {
  const standardTerms = fs.readFileSync(
    path.join(process.cwd(), '..', 'templates', 'Mutual-NDA.md'),
    'utf-8'
  );
  return <NdaCreator standardTerms={standardTerms} />;
}
