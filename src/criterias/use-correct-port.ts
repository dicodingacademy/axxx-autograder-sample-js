import { Checklist } from '../types';
import { execSync } from 'node:child_process';

async function sleep(timeout: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

async function waitUntilPortOpen(port: number, timeout: number): Promise<boolean> {
  if (timeout <= 0) {
    return false;
  }

  const sleepTime = 100;

  try {
    execSync(`lsof -i -P -n | grep "${port} (LISTEN)"`);
    return true;
  } catch {
    await sleep(sleepTime);
    const nextTimeout = timeout - (sleepTime * 2);
    return waitUntilPortOpen(port, nextTimeout);
  }
}

export async function useCorrectPortCheck(): Promise<Checklist> {
  const checklist = {
    key: 'use-correct-port',
    reason: null,
    completed: false
  };

  const EXPECTED_PORT = 9000;
  const isOpened = await waitUntilPortOpen(EXPECTED_PORT, 5_000);

  if (isOpened) {
    checklist.completed = true;
    return checklist;
  }

  checklist.reason = '<p>Pastikan PORT 9000 digunakan oleh aplikasi webmu ketika kami menjalankan berkas <code>main.js</code>.</p>';
  return checklist;
}