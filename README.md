# Autograder - (Nama Autograder)

> Autograder untuk kelas [X](https://www.dicoding.com/academies/x)

## Table of Content

- Setup Autograder
- Cara Menjalankan Autograder
- Flowchart (alur dalam menilai submission)
- Roadmap
- Acceptance Scenarios
- Appendix

## Setup Autograder

*TODO: Jelaskan cara setup proyek autograder (misal, install dependencies, dsb)*

## Cara Menjalankan Autograder

*TODO: Jelaskan cara menjalankan autograder termasuk flag-flag yang disediakan.*

## Flowchart (alur dalam menilai submission)

*TODO: Jelaskan alur autograder menilai submission. Dibuat dengan format mermaid chart.*

## Roadmap checklist

> _Tandai x setiapkali checklist telah selesai._

- [ ] Mendefinisikan Acceptance Scenarios (AS)
- [ ] Mendefinisikan Flowchart (alur dalam menilai submission)
- [ ] Pengembangan
    - [ ] Memastikan kontrak autograder
    - [ ] Teruji (AS terpenuhi)
    - [ ] Integrasi Logging
- [ ] Melengkapi Dokumentasi
- [ ] Integrasi dengan Platform Dicoding
    - [ ] Teruji secara staging
    - [ ] Dijalankan secara production

## Acceptance Scenarios

*TODO: Jelaskan berbagai skenario yang ditangani oleh autograder dalam menilai submission.*

Berikut beberapa skenario (baik negatif dan positif) yang ditangani oleh autograder.

### (Contoh) Kriteria:  Konfigurasi Proyek Node.js

#### (Contoh) Skenario 1: Ketika submission siswa tidak memiliki berkas `package.json`, submission harus ditolak

- Status: `backlog`

- Test coverage: 🔴

- Expected output:

  ```json
  {
    "is_passed": false,
    "message": "<p>kami tidak bisa menemukan file <strong>package.json</strong> pada submission yang kamu kirimkan, perlu diingat pada umumnya aplikasi Node.js memiliki file package.json untuk menyimpan konfigurasi filenya.</p>"
  }
  ```

## Appendix

*TODO: Jelaskan informasi lain yang diperlukan di sini, seperti daftar dependencies, hasil riset, dan lain sebagainya.*