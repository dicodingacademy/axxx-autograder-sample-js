import { describe, expect, it, vi } from 'vitest';
import { join } from 'node:path';
import * as fs from 'node:fs/promises';
import { grade } from './grader';

vi.setConfig({
  testTimeout: 60_000,
});

function getSubmissionFixturePath(...folders: string[]) {
  return join(process.cwd(), 'fixtures', 'submissions', ...folders);
}

async function readReportJson(submissionPath: string) {
  const reportPath = join(submissionPath, 'report.json');
  const text = await fs.readFile(reportPath, 'utf8');
  return JSON.parse(text);
}

describe.sequential('grader', () => {
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

  describe('use-correct-port checklist', () => {
    it('should reject submission when main.js executed but no 9000 port opened', async () => {
      // Arrange
      const submissionPath = getSubmissionFixturePath('wrong-port');

      // Action
      await grade(submissionPath);

      // Action
      const report = await readReportJson(submissionPath);
      expect(report.is_passed).toEqual(false);
      expect(report.message).toContain('<p>Pastikan PORT 9000 digunakan oleh aplikasi webmu ketika kami menjalankan berkas <code>main.js</code>.</p>');
    });

    it('should contain `use-correct-port` in `checklist_keys` when main.js executed and 9000 port opened', async () => {
      // Arrange
      const submissionPath = getSubmissionFixturePath('correct-port');

      // Action
      await grade(submissionPath);

      // Action
      const report = await readReportJson(submissionPath);
      expect(report.checklist_keys).toContain('use-correct-port');
    });
  });

  describe('use-correct-port checklist', () => {
    it('should reject submission when app is not response in html', async () => {
      // Arrange
      const submissionPath = getSubmissionFixturePath('not-response-html');

      // Action
      await grade(submissionPath);

      // Assert
      const report = await readReportJson(submissionPath);
      expect(report.is_passed).toEqual(false);
      expect(report.message).toContain('<p>Aplikasi web yang kamu buat harus me-response dengan format HTML.</p>');
    });

    it('should contain `response-in-html` in `checklist_keys` when app response with html', async () => {
      // Arrange
      const submissionPath = getSubmissionFixturePath('response-html');

      // Action
      await grade(submissionPath);

      // Assert
      const report = await readReportJson(submissionPath);
      expect(report.checklist_keys).toContain('response-in-html');
    });
  });

  describe('response-h1-with-correct-username checklist', () => {
    it('should reject submission when app is not h1 with correct username', async () => {
      // Arrange
      const submissionPath = getSubmissionFixturePath('response-not-correct-username');

      // Action
      await grade(submissionPath);

      // Assert
      const report = await readReportJson(submissionPath);
      expect(report.is_passed).toEqual(false);
      expect(report.message).toContain('<p>Konten yang berada di dalam elemen h1 harus username akun Dicodingmu.</p>');
    });

    it('should contain `response-h1-with-correct-username` in `checklist_keys` when app response h1 with correct username', async () => {
      // Arrange
      const submissionPath = getSubmissionFixturePath('response-correct-username');

      // Action
      await grade(submissionPath);

      // Assert
      const report = await readReportJson(submissionPath);
      expect(report.checklist_keys).toContain('response-h1-with-correct-username');
    });
  });

  describe('Rejection and Approval scenario', () => {
    it('should reject submission when checklist not complete', async () => {
      // Arrange
      const submissionPath = getSubmissionFixturePath('reject-submission');

      // Action
      await grade(submissionPath);

      // Assert
      const report = await readReportJson(submissionPath);
      expect(report.is_passed).toEqual(false);
    });

    it('should approve submission when checklist complete', async () => {
      // Arrange
      const submissionPath = getSubmissionFixturePath('approve-submission');

      // Action
      await grade(submissionPath);

      // Assert
      const report = await readReportJson(submissionPath);
      expect(report.is_passed).toEqual(true);
    });
  });
});