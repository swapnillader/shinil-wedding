// This code should be pasted into Google Apps Script, not hosted on your website
// Follow the setup instructions in the README.md file

function doPost(e) {
  try {
    // Get the form data from request parameters (not JSON)
    const data = e.parameter;
    
    // Open the Google Sheet by ID
    // Replace YOUR_SHEET_ID with your actual Google Sheet ID
    const ss = SpreadsheetApp.openById('1OsmWIAnWFYp50OZJFsWXRqm6WM2zXtZL_s4xwH8tD-A');
    const sheet = ss.getSheetByName('RSVPs') || ss.insertSheet('RSVPs');
    
    // Get the current date and time
    const timestamp = new Date();
    
    // Define the columns order 
    const headers = [
      "Timestamp", 
      "Name", 
      "Email", 
      "Attending", 
      "Number of Guests", 
      "Food Preference", 
      "Bible Verse", 
      "Message"
    ];
    
    // Check if headers exist, if not add them
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    }
    
    // Prepare the row data in the correct order
    const rowData = [
      timestamp,
      data.name || '',
      data.email || '',
      data.attending || '',
      data.guests || '',
      data.food_preference || '',
      data.bible_verse || '',
      data.message || ''
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response with CORS headers
    return HtmlService.createHtmlOutput(
      "<script>window.top.location.href = 'https://shinil-wedding.gitlab.io/success.html';</script>"
    );
      
  } catch (error) {
    // Log the error
    console.error(error);
    
    // Return an error page
    return HtmlService.createHtmlOutput(
      "<p>Error: " + error + "</p><p>Please go back and try again.</p>"
    );
  }
}

// Add this function to test the web app deployment
function doGet() {
  return HtmlService.createHtmlOutput(
    "<p>The Google Script is working correctly. This URL is meant to be used as a form action.</p>"
  );
}
