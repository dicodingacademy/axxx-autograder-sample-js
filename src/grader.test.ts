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

  describe('contain-main-js checklist', () => {
    it('should reject submission when student submission not contain `main.js`', async () => {
      // Arrange
      const submissionPath = getSubmissionFixturePath('not-contain-main-js');

      // Action
      await grade(submissionPath);

      // Assert
      const report = await readReportJson(submissionPath);
      expect(report.is_passed).toEqual(false);
      expect(report.message).toContain('<p>kami tidak bisa menemukan file <strong>main.js</strong> pada submission yang kamu kirimkan. Periksa kembali submissionmu pastikan sesuai dengan kriteria yang ada.</p>');
    });

    it('should `contain-main-js` in `checklist_keys` when submission contain `main.js`', async () => {
      // Arrange
      const submissionPath = getSubmissionFixturePath('contain-main-js');

      // Action
      await grade(submissionPath);

      // Assert
      const report = await readReportJson(submissionPath);
      expect(report.checklist_keys).toContain('contain-main-js');
    });
  });

  describe('main-js-contain-username checklist', () => {
    it('should reject submission when main.js is not contain comment that hold correct student username', async () => {
      // Arrange
      const submissionPath = getSubmissionFixturePath('main-js-wrong-username');

      // Action
      await grade(submissionPath);

      // Assert
      const report = await readReportJson(submissionPath);
      expect(report.is_passed).toEqual(false);
      expect(report.message).toContain('<p>Pastikan kamu menuliskan username akun Dicoding dalam bentuk komentar di berkas <code>main.js</code></p>');
    });

    it('should `main-js-contain-username` in `checklist_keys` when submission contain `main.js`', async () => {
      // Arrange
      const submissionPath = getSubmissionFixturePath('main-js-correct-username');

      // Action
      await grade(submissionPath);

      // Assert
      const report = await readReportJson(submissionPath);
      expect(report.checklist_keys).toContain('main-js-contain-username');
    });
  });
});