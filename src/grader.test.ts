import { describe, expect, it } from 'vitest';
import { join } from 'node:path';
import * as fs from 'node:fs/promises';
import { grade } from './grader';

function getSubmissionFixturePath(...folders: string[]) {
  return join(process.cwd(), 'fixtures', 'submissions', ...folders);
}

async function readReportJson(submissionPath: string) {
  const reportPath = join(submissionPath, 'report.json');
  const text = await fs.readFile(reportPath, 'utf8');
  return JSON.parse(text);
}


describe('grader', () => {
  describe('contain-package-json checklist', () => {
    it('should reject submission when student submission not contain `package.json`', async () => {
      // Arrange
      const submissionPath = getSubmissionFixturePath('not-contain-package-json');

      // Action
      await grade(submissionPath);

      // Assert
      const report = await readReportJson(submissionPath);
      expect(report.is_passed).toEqual(false);
      expect(report.message).toContain('<p>kami tidak bisa menemukan file <strong>package.json</strong> pada submission yang kamu kirimkan, perlu diingat pada umumnya aplikasi Node.js memiliki file package.json untuk menyimpan konfigurasi filenya.</p>');
    });

    it('should `contain-package-json` in `checklist_keys` when submission submission contain `package.json`', async () => {
      // Arrange
      const submissionPath = getSubmissionFixturePath('contain-package-json');

      // Action
      await grade(submissionPath);

      // Assert
      const report = await readReportJson(submissionPath);
      expect(report.checklist_keys).toContain('contain-package-json');
    });
  });
});