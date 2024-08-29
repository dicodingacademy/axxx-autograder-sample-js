import { Checklist } from '../types';

export async function responseInHtmlCheck(): Promise<Checklist> {
  const checklist: Checklist = {
    key: 'response-in-html',
    reason: null,
    completed: false,
  };

  const response = await fetch('http://localhost:9000');
  const contentType = response.headers.get('content-type');

  if (!contentType.includes('text/html')) {
    checklist.reason = '<p>Aplikasi web yang kamu buat harus me-response dengan format HTML.</p>';
    return checklist;
  }

  checklist.completed = true;
  return checklist;
}