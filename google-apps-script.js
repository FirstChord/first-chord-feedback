/**
 * Google Apps Script for Music School Feedback System
 * This script receives form submissions and writes them to Google Sheets
 */

// Configuration
const SPREADSHEET_ID = '1cpBRLNQfvrsNRp5ybm4F0IxKFOsOwM7YSBChOYARIJ0';
const SHEET_NAME = 'Feedback_Responses';
const HEADERS = ['Timestamp', 'Source', 'Name', 'Message', 'Category'];

/**
 * Main function to handle POST requests from feedback forms
 */
function doPost(e) {
  try {
    // Set up CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };
    
    // Parse the request data
    let requestData;
    try {
      // Check if we have POST data
      if (!e || !e.postData || !e.postData.contents) {
        return createErrorResponse('No POST data received', headers);
      }
      
      requestData = JSON.parse(e.postData.contents);
    } catch (parseError) {
      Logger.log('JSON parse error: ' + parseError.toString());
      return createErrorResponse('Invalid JSON data', headers);
    }
    
    // Validate required fields
    if (!requestData.feedback || !requestData.source) {
      return createErrorResponse('Missing required fields (feedback, source)', headers);
    }
    
    // Get or create the spreadsheet
    const sheet = getOrCreateSheet();
    
    // Prepare data for insertion
    const rowData = [
      new Date(), // Timestamp
      requestData.source || 'Unknown',
      requestData.name || '', // Empty string for anonymous
      requestData.feedback || '',
      requestData.category || 'General/Other'
    ];
    
    // Insert data into sheet
    sheet.appendRow(rowData);
    
    // Log successful submission
    Logger.log('Feedback submitted successfully: ' + JSON.stringify({
      source: requestData.source,
      hasName: !!requestData.name,
      feedbackLength: requestData.feedback.length,
      category: requestData.category
    }));
    
    // Return success response
    const output = ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Feedback submitted successfully',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
    // Set CORS headers individually
    output.setHeader('Access-Control-Allow-Origin', '*');
    output.setHeader('Content-Type', 'application/json');
    
    return output;
      
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createErrorResponse('Internal server error: ' + error.message, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    });
  }
}

/**
 * Handle GET requests for testing
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'Music School Feedback API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
function doOptions() {
  const output = ContentService.createTextOutput('');
  output.setHeader('Access-Control-Allow-Origin', '*');
  output.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  output.setHeader('Access-Control-Max-Age', '86400');
  return output;
}

/**
 * Get existing sheet or create new one with proper headers
 */
function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    // Create new sheet
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    
    // Add headers
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setValues([HEADERS]);
    
    // Format headers
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, HEADERS.length);
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    Logger.log('Created new sheet: ' + SHEET_NAME);
  } else {
    // Verify headers exist
    const existingHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    if (existingHeaders.join(',') !== HEADERS.join(',')) {
      // Update headers if they don't match
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      Logger.log('Updated headers in existing sheet');
    }
  }
  
  return sheet;
}

/**
 * Create standardized error response
 */
function createErrorResponse(message, headers = {}) {
  const output = ContentService
    .createTextOutput(JSON.stringify({
      success: false,
      error: message,
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  // Set headers individually for compatibility
  for (const [key, value] of Object.entries(headers)) {
    output.setHeader(key, value);
  }
  
  return output;
}

/**
 * Setup function to initialize the spreadsheet
 * Run this once after deploying the script
 */
function setupSpreadsheet() {
  try {
    const sheet = getOrCreateSheet();
    
    // Add some formatting
    const dataRange = sheet.getDataRange();
    if (dataRange.getNumRows() > 1) {
      // Format data rows
      const dataRows = sheet.getRange(2, 1, dataRange.getNumRows() - 1, HEADERS.length);
      dataRows.setBorder(true, true, true, true, true, true);
    }
    
    // Set column widths
    sheet.setColumnWidth(1, 150); // Timestamp
    sheet.setColumnWidth(2, 100); // Source
    sheet.setColumnWidth(3, 150); // Name
    sheet.setColumnWidth(4, 400); // Message
    sheet.setColumnWidth(5, 150); // Category
    
    Logger.log('Spreadsheet setup completed successfully');
    return 'Setup completed successfully';
    
  } catch (error) {
    Logger.log('Error in setupSpreadsheet: ' + error.toString());
    throw error;
  }
}

/**
 * Test function to verify the script works
 */
function testSubmission() {
  const testData = {
    source: 'Test',
    name: 'Test User',
    feedback: 'This is a test submission to verify the Google Apps Script is working correctly.',
    category: 'General/Other'
  };
  
  try {
    const sheet = getOrCreateSheet();
    const rowData = [
      new Date(),
      testData.source,
      testData.name,
      testData.feedback,
      testData.category
    ];
    
    sheet.appendRow(rowData);
    Logger.log('Test submission successful');
    return 'Test submission added successfully';
    
  } catch (error) {
    Logger.log('Test submission failed: ' + error.toString());
    throw error;
  }
}

/**
 * Get submission statistics
 */
function getStats() {
  try {
    const sheet = getOrCreateSheet();
    const dataRange = sheet.getDataRange();
    const numSubmissions = Math.max(0, dataRange.getNumRows() - 1); // Subtract header row
    
    if (numSubmissions === 0) {
      return {
        totalSubmissions: 0,
        sources: {},
        categories: {}
      };
    }
    
    const data = dataRange.getValues().slice(1); // Remove headers
    
    // Count by source
    const sources = {};
    const categories = {};
    
    data.forEach(row => {
      const source = row[1] || 'Unknown';
      const category = row[4] || 'General/Other';
      
      sources[source] = (sources[source] || 0) + 1;
      categories[category] = (categories[category] || 0) + 1;
    });
    
    return {
      totalSubmissions: numSubmissions,
      sources: sources,
      categories: categories,
      lastUpdated: new Date().toISOString()
    };
    
  } catch (error) {
    Logger.log('Error getting stats: ' + error.toString());
    throw error;
  }
}
