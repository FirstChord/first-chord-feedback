# Google Apps Script Deployment Instructions

## Step 1: Create a New Google Apps Script Project

1. Go to [script.google.com](https://script.google.com)
2. Click **"New Project"**
3. Replace the default code with the contents of `google-apps-script.js`
4. Save the project with a name like "Music School Feedback API"

## Step 2: Your Google Spreadsheet is Ready!

✅ **Your spreadsheet is already configured:**

- **URL**: https://docs.google.com/spreadsheets/d/1cpBRLNQfvrsNRp5ybm4F0IxKFOsOwM7YSBChOYARIJ0/edit
- **Spreadsheet ID**: `1cpBRLNQfvrsNRp5ybm4F0IxKFOsOwM7YSBChOYARIJ0`
- **Status**: Pre-integrated into the code

The Google Apps Script is already configured to use your specific spreadsheet, so you can skip the manual linking step!

## Step 3: Set Up the Spreadsheet Structure

1. In the Apps Script editor, run the `setupSpreadsheet()` function:
   - Click on the function name in the dropdown
   - Click the **Run** button (▶️)
   - Authorize the script when prompted
2. Check your spreadsheet - it should now have:
   - A sheet named "Feedback_Responses"
   - Headers: Timestamp | Source | Name | Message | Category
   - Proper formatting and column widths

## Step 4: Deploy as Web App

1. In Apps Script, click **Deploy** → **New Deployment**
2. Click the gear icon ⚙️ next to "Type" and select **"Web app"**
3. Configure the deployment:
   - **Description**: "Music School Feedback API v1.0"
   - **Execute as**: "Me (your email)"
   - **Who has access**: "Anyone" (this allows your forms to submit data)
4. Click **Deploy**
5. **IMPORTANT**: Copy the Web App URL - you'll need this for your forms

## Step 6: Test the Deployment

1. Run the `testSubmission()` function in Apps Script
2. Check your spreadsheet for a test entry
3. Visit the Web App URL in your browser - you should see a JSON response

## Step 6: Update Your Forms

The Web App URL will look like:

```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Copy this URL and update `config.js`:

1. Open `config.js`
2. Replace `YOUR_WEB_APP_URL_HERE` with your actual Web App URL
3. Save the file

## Quick Test

1. Open `test-integration.html` in your browser
2. Paste your Web App URL and test the connection
3. Submit test feedback to verify everything works
4. Check your Google Sheets at: https://docs.google.com/spreadsheets/d/1cpBRLNQfvrsNRp5ybm4F0IxKFOsOwM7YSBChOYARIJ0/edit

## Security Notes

- The script is set to "Execute as: Me" which means it runs with your permissions
- "Anyone" access is required so your public forms can submit data
- No sensitive data is exposed - only feedback submissions are accepted
- Consider adding basic rate limiting if you expect high traffic

## Troubleshooting

**"Authorization required" error:**

- Make sure you've run `setupSpreadsheet()` and authorized the script

**CORS errors:**

- Ensure the Web App is deployed with "Anyone" access
- Check that you're using the correct Web App URL (not the script editor URL)

**Submissions not appearing:**

- Check the Apps Script logs (View → Logs)
- Your spreadsheet URL: https://docs.google.com/spreadsheets/d/1cpBRLNQfvrsNRp5ybm4F0IxKFOsOwM7YSBChOYARIJ0/edit
- Ensure the sheet name is exactly "Feedback_Responses"

**Testing:**

- Use the `testSubmission()` function to verify everything works
- Check the execution transcript for any errors
- Use `getStats()` to see submission counts

## Maintenance

- View submission statistics by running `getStats()`
- Check logs regularly for any errors
- The spreadsheet will automatically expand as submissions come in
- Consider backing up your data periodically
