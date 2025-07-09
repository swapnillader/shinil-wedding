# Setting Up Your RSVP Form with Google Sheets

This guide will help you connect your wedding website's RSVP form directly to Google Sheets.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name your spreadsheet something like "Wedding RSVPs"
3. Note down the spreadsheet ID (it's the long string in the URL between /d/ and /edit)
   - Example: In `https://docs.google.com/spreadsheets/d/1ABC123_EXAMPLE_ID_456XYZ/edit`, the ID is `1ABC123_EXAMPLE_ID_456XYZ`

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, click on **Extensions** → **Apps Script**
2. Delete any code in the editor and replace it with the code from the `google-apps-script.js` file in this repository
3. Update the `YOUR_SHEET_ID` placeholder with your actual Google Sheet ID
4. Click the **Save** button (disk icon) and name your project "Wedding RSVP Form Handler"

## Step 3: Deploy as Web App

1. Click on **Deploy** → **New deployment**
2. For "Select type", choose **Web app**
3. Fill in the following settings:
   - Description: "Wedding RSVP Form Handler"
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Click **Deploy**
5. Authorize the app when prompted
6. Copy the Web app URL provided (it will look like `https://script.google.com/macros/s/.../exec`)

## Step 4: Update Your Website

1. Open the `js/main.js` file in your website project
2. Find the line with `const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL';`
3. Replace `YOUR_GOOGLE_SCRIPT_URL` with the Web app URL you copied in Step 3
4. Save the file and upload all changes to your hosting provider

## Testing Your Form

1. Fill out the RSVP form on your website and submit it
2. Check your Google Sheet to see if the data appears
3. If there are any issues, check the browser console for error messages

## Troubleshooting

- **CORS Issues**: If you see CORS errors in the console, make sure your Google Apps Script is deployed correctly with "Anyone" access
- **Data Not Appearing**: Check that your spreadsheet ID is correct in the Google Apps Script
- **Form Errors**: Ensure all the field names in your HTML form match what the script is expecting

## Security Note

This implementation allows anyone to submit data to your Google Sheet. If you're concerned about spam or abuse, consider adding a simple verification token to the form.
