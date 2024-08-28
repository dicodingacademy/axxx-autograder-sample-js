import { SubmissionInfo } from './types';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';

export async function getSubmissionInfo(path: string): Promise<SubmissionInfo>{
  const submissionInfoFilePath = join(path, 'auto-review-config.json');
  const text = await fs.readFile(submissionInfoFilePath, 'utf8');
  const json = JSON.parse(text);

  return {
    id: json.id,
    submitterUsername: json.submitter_username,
    submitterName: json.submitter_name,
    submitterBirthday: json.submitter_birthday,
    quizId: json.quiz_id,
    courseId: json.course_id,
    rejectedCount: json.rejected_count,
  };
}