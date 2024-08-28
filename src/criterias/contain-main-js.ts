import { Checklist } from '../types';
import { findFolderBaseOnFile } from '../utils';

export async function checkContainMainJs(projectPath: string): Promise<Checklist> {
  const checklist: Checklist = {
    key: 'contain-main-js',
    reason: null,
    completed: false,
  };
  const mainJsFolderPath = await findFolderBaseOnFile(projectPath, 'main.js');

  if (mainJsFolderPath === null) {
    checklist.reason = '<p>kami tidak bisa menemukan file <strong>main.js</strong> pada submission yang kamu kirimkan. Periksa kembali submissionmu pastikan sesuai dengan kriteria yang ada.</p>';
    return checklist;
  }

  checklist.completed = true;
  return checklist;
}