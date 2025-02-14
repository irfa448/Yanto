# Cara Deploy ke Vercel

1. **Daftar & Login Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Sign up pake akun GitHub lu
   - Install Vercel CLI: `npm i -g vercel`

2. **Setup Project**
   - Fork atau clone repo ini ke GitHub lu
   - Di dashboard Vercel, klik "New Project"
   - Import repository dari GitHub
   - Pilih repository yang udah lu fork/clone

3. **Konfigurasi Environment Variables**
   - Di settings project, cari "Environment Variables"
   - Tambah variable `GEMINI_API_KEY` dengan value API key lu
   - Save settings
   - **PENTING**: Pastiin lu udah nambahin API key sebelum deploy, kalo ngga chatbotnya bakal error!

4. **Deploy**
   - Vercel bakal otomatis build & deploy project lu
   - Framework preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

5. **Cek Hasil**
   - Klik URL yang dikasih Vercel (biasanya `[nama-project].vercel.app`)
   - Test chatbot lu, pastiin bisa ngeresponse dengan normal
   - Kalo ada error, cek di dashboard Vercel:
     - Pastiin environment variable `GEMINI_API_KEY` udah bener
     - Cek logs di bagian "Deployments"

Note: 
- Kalo lu update kode di GitHub, Vercel bakal otomatis deploy ulang project lu
- Jangan lupa set environment variable `GEMINI_API_KEY` di Vercel, soalnya ini yang bikin error kalo lupa!