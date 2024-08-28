import { describe, expect, it } from 'vitest';
import { join } from 'node:path';
import { getSubmissionInfo } from './utils';

function getSubmissionFixturePath(...folders: string[]) {
  return join(process.cwd(), 'fixtures', 'submissions', ...folders);
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
});