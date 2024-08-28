import { Checklist } from '../types';
import { findFolderBaseOnFile } from '../utils';

export async function checkContainPackageJson(submissionPath: string): Promise<Checklist> {
  const checklist: Checklist = {
    key: 'contain-package-json',
    completed: false,
    reason: null,
  };

  const packageJsonFolderPath = await findFolderBaseOnFile(submissionPath, 'package.json');

  if (packageJsonFolderPath === null) {
    checklist.reason = '<p>kami tidak bisa menemukan file <strong>package.json</strong> pada submission yang kamu kirimkan, perlu diingat pada umumnya aplikasi Node.js memiliki file package.json untuk menyimpan konfigurasi filenya.</p>';
    return checklist;
  }

  checklist.completed = true;
  return checklist;
}