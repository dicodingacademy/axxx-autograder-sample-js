import { Checklist, SubmissionInfo } from '../types';
import { findFolderBaseOnFile } from '../utils';
import { join } from 'node:path';
import extractComments from 'esprima-extract-comments';
import { readFile } from 'node:fs/promises';

export async function mainJsContainUsernameCheck(projectPath: string, submissionInfo: SubmissionInfo): Promise<Checklist> {
  const checklist: Checklist = {
    key: 'main-js-contain-username',
    reason: null,
    completed: false,
  };

  const mainJsFolderPath = await findFolderBaseOnFile(projectPath, 'main.js');
  const mainJsFilePath = join(mainJsFolderPath, 'main.js');
  const mainJsCode = await readFile(mainJsFilePath, 'utf8');

  const comments = extractComments(mainJsCode);

  const { submitterUsername } = submissionInfo;

  const isContainCorrectUsername = comments.some((comment) => comment.value.toLowerCase().trim() === submitterUsername.toLowerCase());

  if (!isContainCorrectUsername) {
    checklist.reason = '<p>Pastikan kamu menuliskan username akun Dicoding dalam bentuk komentar di berkas <code>main.js</code></p>.';
    return checklist;
  }

  checklist.completed = true;
  return checklist;
}