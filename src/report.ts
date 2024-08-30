import { Checklist, Report, SubmissionInfo } from './types';
import { writeReportJson } from './utils';
import { logger } from './logging';

const TOTAL_CHECKLIST = 6;

async function buildApprovedReport(checklists: Checklist[], submissionInfo: SubmissionInfo, submissionPath: string) {
  const { id, submitterName, courseId } = submissionInfo;
  const approvedTemplate = '<p>Halo <strong>$submitter_name!</strong>&nbsp;Terima kasih telah sabar menunggu. Kami membutuhkan waktu untuk bisa memberikan <em>feedback</em> sekomprehensif mungkin kepada setiap peserta kelas. Dalam kesempatan ini ada &nbsp;4 (empat) hal yang ingin kami sampaikan.&nbsp;</p><p><strong>Pertama</strong>, kami ingin mengucapkan selamat! Karena kamu telah menyelesaikan tugas submission dari kelas Belajar Membuat Aplikasi Back-End untuk Pemula. Jangan lihat bintang yang kamu raih, tapi lihat kemajuan yang sudah kamu capai. Ingat semua <em>expert&nbsp;</em>dahulu pemula.&nbsp;</p><p><strong>K</strong><strong>edua</strong>, kamu boleh bangga karena telah menyelesaikan submission sesuai dengan kriteria yang telah kami tentukan. Mumpung masih hangat semangatnya langsung lanjut kelas selanjutnya yaitu <a href="https://www.dicoding.com/academies/266">Architecting on AWS (Membangun Arsitektur AWS di Cloud)</a> atau <a data-target-href="https://www.dicoding.com/academies/14" href="https://www.dicoding.com/academies/271">Belajar Fundamental Aplikasi Back-End</a>.&nbsp;</p><p><strong>K</strong><strong>etiga</strong>, beberapa lulusan tidak tahu mereka memiliki akses kelas selamanya. Sebagai informasi kelas Dicoding selalu <em>update&nbsp;</em>sehingga memiliki perbedaan minimal 30% dari sejak kelas dirilis. Silakan mampir kembali untuk melihat materi saat kamu membutuhkan <em>update</em>.&nbsp;</p><p><strong>K</strong><strong>eempat</strong>, karena sudah praktik langsung maka kamu sudah menguasai ilmu kelas dasar ini antara 75-90%. Salah satu cara agar meningkatkan penguasaan ilmu agar bisa lebih maksimal (&gt;90%) adalah dengan memperbanyak latihan atau mengajarkan ilmu kepada orang lain.</p><p>Salah satu misi Dicoding adalah menyebarkan ilmu yang bermanfaat. Kami berusaha membangun kurikulum standar global dengan harapan agar developer Indonesia bisa menjadi jawara di negeri sendiri. Namun misi ini tidak akan tercapai tanpa kolaborasi dari kita semua.</p><p>Silakan berkunjung ke <a href="https://www.dicoding.com/academies/$course_id/discussions" rel="noopener noreferrer" target="_blank">forum diskusi</a> untuk mengasah kembali penguasaan ilmu kamu dan membuat ilmu kamu bisa semakin bermanfaat dengan membantu developer yang lain.&nbsp;</p><p dir="ltr">Terima kasih telah membantu misi kami. Kesuksesan developer Indonesia adalah energi bagi kami. Jika memiliki pertanyaan terkait hasil submission, silakan mengikuti prosedur <a href="https://help.dicoding.com/academy-dicoding/prosedur-banding-hasil-review-submission-kelas" rel="noopener noreferrer" target="_blank">berikut</a>.</p><hr><p style="text-align: right;"><em>Salam</em></p><p style="text-align: right;"><span style="color: rgb(226, 80, 65);">Dicoding Reviewer</span></p>';

  const message = approvedTemplate
    .replace('$submitter_name', submitterName)
    .replace('$course_id', String(courseId));

  const checklistKeys = checklists.map((checklist) => checklist.key);

  const report: Report = {
    submissionId: id,
    message,
    checklistKeys,
    isPassed: true,
    rating: 5
  };

  await writeReportJson(report, submissionPath);
}

async function buildRejectionReport(checklists: Checklist[], submissionInfo: SubmissionInfo, submissionPath: string) {
  const { id, submitterName, courseId } = submissionInfo;
  const rejectedTemplate = '<p>Hai <strong>$submitter_name</strong><strong>!</strong> terima kasih telah sabar menunggu. Kami membutuhkan waktu untuk bisa memberikan <em>feedback&nbsp;</em>sekomprehensif mungkin. Setiap submission diperiksa satu per satu oleh tim reviewer yang memiliki sertifikasi global atau telah bekerja di perusahaan ternama.</p><p>Setelah dilakukan proses <em>review&nbsp;</em><em>project&nbsp;</em>yang kamu kirimkan, project tersebut <strong>belum memenuhi kriteria</strong> untuk lulus kelas <em>Belajar Membuat Aplikasi Back-End untuk Pemula</em>.</p><p>Oleh karena itu kami harus menolak submission project kamu. Berikut adalah <em>beberapa catatan yang harus terpenuhi</em> untuk menyelesaikan tugas submission:</p><ul>$reason</ul><p>Jika kamu sudah lebih dari 1x ditolak maka jangan pernah menyerah, karena ada lulusan Dicoding yang akhirnya lulus satu kelas setelah 48x ditolak. Meskipun demikian tim reviewer tetap profesional dan dengan senang hati memberikan <em>feedback&nbsp;</em>terbaik yang kami bisa.</p><p>Silakan <em>update&nbsp;</em><em>project&nbsp;</em>kamu dengan mengikuti beberapa saran di atas. Jika ada pertanyaan atau kendala dalam menerapkan beberapa saran di atas, silakan bertanya di forum <a data-target-href="https://www.dicoding.com/academies/$course_id/discussions" href="https://www.dicoding.com/academies/$course_id/discussions" rel="noopener noreferrer" target="_blank">academy discussion</a>. Dengan senang hati kami akan membantu menjawab pertanyaan kamu.</p><hr><p style="text-align: right;"><em>Salam</em></p><p style="text-align: right;"><span style="color: rgb(226, 80, 65);">Dicoding Reviewer</span></p>';
  const reasons = checklists
    .filter((checklist) => checklist.reason !== null)
    .map((checklist) => `<li>${checklist.reason}</li>`)
    .join('');

  const message = rejectedTemplate
    .replace('$submitter_name', submitterName)
    .replace('$course_id', String(courseId))
    .replace('$reason', reasons);

  const checklistKeys = checklists
    .filter((checklist) => checklist.completed)
    .map((checklists) => checklists.key);

  const report: Report = {
    submissionId: id,
    message,
    checklistKeys,
    isPassed: false,
    rating: 0
  };

  await writeReportJson(report, submissionPath);
}

export function buildReport(checklists: Checklist[], submissionInfo: SubmissionInfo, submissionPath: string) {
  const completedChecklist = checklists.filter((checklist) => checklist.completed);

  if (completedChecklist.length === TOTAL_CHECKLIST) {
    logger.info('(reporting) submission will be approve');
    return buildApprovedReport(checklists, submissionInfo, submissionPath);
  }

  logger.info('(reporting) submission will be reject');
  return buildRejectionReport(checklists, submissionInfo, submissionPath);
}