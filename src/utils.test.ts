import { describe, expect, it } from 'vitest';
import { join } from 'node:path';
import { findFolderBaseOnFile, getSubmissionInfo, installDependencies, writeReportJson } from './utils';
import * as fs from 'node:fs/promises';
import { Report } from './types';
import { access, rm } from 'node:fs/promises';

function getSubmissionFixturePath(...folders: string[]) {
  return join(process.cwd(), 'fixtures', 'submissions', ...folders);
}

function readReportJson(submissionPath: string) {
  const reportPath = join(submissionPath, 'report.json');
  return fs.readFile(reportPath, 'utf8');
}

async function isContainDirectory(base: string, name: string) {
  const path = join(base, name);

  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

describe('utils', () => {
  describe('getSubmissionInfo', () => {
    it('should return `SubmissionInfo` correctly', async () => {
      // Arrange
      const path = getSubmissionFixturePath('not-contain-package-json');

      // Action
      const submissionInfo = await getSubmissionInfo(path);

      // Assert
      expect(submissionInfo).toMatchSnapshot();
    });
  });

  describe('writeReportJson', () => {
    it('should write report.json correctly', async () => {
      // Arrange
      const path = getSubmissionFixturePath('not-contain-package-json');
      const report: Report = {
        submissionId: 123,
        message: '<p>Selamat! Submission Anda diterima</p>',
        isPassed: true,
        checklistKeys: ['checklist-a', 'checklist-b'],
        rating: 5,
      };

      // Action
      await writeReportJson(report, path);

      // Assert
      const reportJson = await readReportJson(path);
      expect(reportJson).toMatchSnapshot();
    });
  });

  describe('findFolderBaseOnFile', () => {
    it('should return null when looked up file is not found', async () => {
      // Arrange
      const projectPath = getSubmissionFixturePath('not-contain-package-json');

      // Action
      const result = await findFolderBaseOnFile(projectPath, 'package.json');

      // Assert
      expect(result).toEqual(null);
    });

    it('should return folder path when looked up file and is found', async () => {
      // Arrange
      const projectPath = getSubmissionFixturePath('contain-package-json-nested');

      // Action
      const result = await findFolderBaseOnFile(projectPath, 'package.json');

      // Assert
      expect(result).toContain(join('contain-package-json-nested', 'project'));
    });
  });

  describe('installDependencies', () => {
    it('should install dependencies correctly', async () => {
      // Arrange
      const submissionPath = getSubmissionFixturePath('contain-package-json');

      // Action
      await installDependencies(submissionPath);

      // Assert
      const isExist = await isContainDirectory(submissionPath, 'node_modules');
      expect(isExist).toEqual(true);

      // Clean-up
      const nodeModulesFolder = join(submissionPath, 'node_modules');
      const packageLockJson = join(submissionPath, 'package-lock.json');
      await rm(nodeModulesFolder, { recursive: true });
      await rm(packageLockJson);
    });
  });
});