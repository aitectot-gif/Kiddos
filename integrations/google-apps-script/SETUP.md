# Connect the website enquiry form (Google Sheet + email alert)

Enquiries are saved to a Google Sheet and an alert is emailed to **kiddosparadise19@gmail.com**.
Do these steps signed in to the **kiddosparadise19@gmail.com** Google account (about 5 minutes).

1. Go to https://sheets.new — a new spreadsheet opens. Name it **Kiddos Paradise — Website Enquiries**.
2. Menu **Extensions → Apps Script**. Delete everything in `Code.gs` and paste the full contents of `Code.gs` from this folder. Click **Save** (💾).
3. In the function dropdown at the top choose **testSetup**, click **Run**.
   - Google asks for permission → **Review permissions** → choose the account → **Advanced → Go to (project) (unsafe)** → **Allow**. (It's your own script; it only needs to edit this sheet and send email.)
   - Check: a new **Enquiries** tab with a test row appears in the sheet, and a "New website enquiry" email arrives at kiddosparadise19@gmail.com. Delete the test row.
4. Click **Deploy → New deployment** → gear ⚙ → **Web app**.
   - Description: `Website enquiries`
   - Execute as: **Me (kiddosparadise19@gmail.com)**
   - Who has access: **Anyone**
   - Click **Deploy** and copy the **Web app URL** (ends in `/exec`).
5. Send that URL to Tectot. It goes into `FORM_ENDPOINT` in `assets/js/main.js`; then a live test enquiry is sent from the website and checked in the sheet and inbox.

**Later changes to the script:** use **Deploy → Manage deployments → ✏ Edit → Version: New version → Deploy** so the URL stays the same.

**Limits:** a free Gmail account can send about 100 alert emails per day — far above normal enquiry volume. Every enquiry is saved in the sheet even if an alert email fails.
