# Branch School Facilities — anonymous report receiver

The checklist homepage is `index.html`. It already has a **Submit Daily Report** button, but submission is intentionally inactive until you deploy a receiver.

## One-time setup
1. Open [script.google.com](https://script.google.com), create a **New project** in the school's Google account, and paste the contents of `apps-script/Code.gs`.
2. In GitHub, create a **fine-grained personal access token** scoped to **only** `TheBranch-AB/branch-school-support`, with **Contents: Read and write**. Choose an expiration and plan to rotate it. **Never paste it into a public GitHub file, the checklist webpage, or this chat.** Depending on organization policies, an organization admin may need to approve the token.
3. In Apps Script, go to **Project Settings → Script properties**, add `GITHUB_TOKEN` with that token's value.
4. **Deploy → New deployment → Web app**, Execute as **Me**, access **Anyone**. Authorize access and copy the **/exec** URL. This opens an anonymous submission endpoint. Anonymous endpoints can be abused; avoid confidential information.
5. In `index.html`, replace `const SUBMISSION_ENDPOINT='';` with `const SUBMISSION_ENDPOINT='YOUR_EXEC_URL';`, and commit. The URL is public, but the token must remain private.
6. Submit a test report, then check that a new JSON file appears under `reports/YYYY-MM-DD/` in this repository.

**Important limitations:** The browser uses a cross-origin submission mode that cannot confirm GitHub success. The on-screen “sent” notice is not a receipt. Open `reports.html` to verify a report exists. Do not click Start New Day until confirmation. GitHub Pages and the reports are public; anyone with the URL can read them. This starter receiver has no staff identity verification, rate limiting, or abuse protection. Use it only for non-sensitive, low-risk checklist records. For stronger reliability and access control, use a hosted API with a protected account or a Google Workspace form/Sheet instead.

Scott can open `https://thebranch-ab.github.io/branch-school-support/reports.html` to view the report index after submissions begin.
