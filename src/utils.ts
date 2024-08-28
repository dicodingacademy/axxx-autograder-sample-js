import { Report, SubmissionInfo } from './types';
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

export async function writeReportJson(report: Report, submissionPath: string): Promise<void> {
  const payload = {
    submission_id: report.submissionId,
    message: report.message,
    checklist_keys: report.checklistKeys,
    is_passed: report.isPassed,
    rating: report.rating,
    is_draft: false,
  };

  const reportPath = join(submissionPath, 'report.json');

  await fs.writeFile(reportPath, JSON.stringify(payload), 'utf8');
}