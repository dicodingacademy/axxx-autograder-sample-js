import { Checklist, SubmissionInfo } from '../types';

export async function responseH1WithCorrectUsernameCheck(submissionInfo: SubmissionInfo): Promise<Checklist> {
  const checklist: Checklist = {
    key: 'response-h1-with-correct-username',
    completed: false,
    reason: null,
  };

  const response = await fetch('http://localhost:9000');
  const responseText = await response.text();

  const { submitterUsername } = submissionInfo;

  const expectedText = `<h1>${submitterUsername}</h1>`.toLowerCase();

  if (!responseText.includes(expectedText)) {
    checklist.reason = '<p>Konten yang berada di dalam elemen h1 harus username akun Dicodingmu.</p>';
    return checklist;
  }

  checklist.completed = true;
  return checklist;
}