import { describe, expect, it } from 'vitest';
import { join } from 'node:path';
import * as fs from 'node:fs/promises';
import { Checklist } from './types';
import { getSubmissionInfo } from './utils';
import { buildReport } from './report';

function getSubmissionFixturePath(...folders: string[]) {
  return join(process.cwd(), 'fixtures', 'submissions', ...folders);
}

function readReportJson(submissionPath: string) {
  const reportPath = join(submissionPath, 'report.json');
  return fs.readFile(reportPath, 'utf8');
}

describe('report', () => {
  describe('buildReport', () => {
    it('should build rejected report correctly', async () => {
      // Arrange
      const submissionPath = getSubmissionFixturePath('not-contain-package-json');
      const checklists: Checklist[] = [
        {
          key: 'checklist-1',
          reason: '<p>Submission kamu belum memenuhi checklist-1</p>',
          completed: false,
        },
        {
          key: 'checklist-2',
          reason: null,
          completed: true,
        }
      ];
      const submissionInfo = await getSubmissionInfo(submissionPath);

      // Action
      await buildReport(checklists, submissionInfo, submissionPath);

      // Assert
      const report = await readReportJson(submissionPath);
      expect(report).toMatchSnapshot();
    });

    it('should build approved report correctly', async () => {
      // Arrange
      const submissionPath = getSubmissionFixturePath('not-contain-package-json');
      const checklists: Checklist[] = [
        {
          key: 'checklist-1',
          reason: null,
          completed: true,
        },
        {
          key: 'checklist-2',
          reason: null,
          completed: true,
        },
        {
          key: 'checklist-3',
          reason: null,
          completed: true
        },
        {
          key: 'checklist-4',
          reason: null,
          completed: true,
        },
        {
          key: 'checklist-5',
          reason: null,
          completed: true,
        },
        {
          key: 'checklist-6',
          reason: null,
          completed: true,
        }
      ];
      const submissionInfo = await getSubmissionInfo(submissionPath);

      // Action
      await buildReport(checklists, submissionInfo, submissionPath);

      // Assert
      const report = await readReportJson(submissionPath);
      expect(report).toMatchSnapshot();
    });
  });
});