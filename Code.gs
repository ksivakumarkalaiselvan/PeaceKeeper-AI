/**
 * PeaceKeeper AI — Autonomous Treaty Compliance & Peacebuilding Platform
 * Google Apps Script Web App Backend (Code.gs)
 * 
 * Instructions:
 * 1. Open your Google Spreadsheet ("PeaceKeeper_AI_DB").
 * 2. Click Extensions > Apps Script.
 * 3. Replace all existing code with this Code.gs content.
 * 4. Run the function `setupDatabaseSheets()` once to auto-create all tabs & headers.
 * 5. Click Deploy > New Deployment > Web App.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL for integration into your .env file as GOOGLE_APPS_SCRIPT_URL.
 */

// Spreadsheet Configuration
function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Automatically creates all required tabs and writes column headers (Row 1)
 */
function setupDatabaseSheets() {
  const ss = getSpreadsheet();
  
  const schema = {
    'users': ['id', 'name', 'email', 'passwordHash', 'role', 'avatarUrl', 'notificationPrefs', 'createdAt'],
    'reports': ['id', 'reportedBy', 'country', 'state', 'district', 'lat', 'lng', 'conflictType', 'description', 'evidenceImages', 'videos', 'documents', 'status', 'riskLevel', 'riskPercentage', 'createdAt'],
    'alerts': ['id', 'level', 'title', 'message', 'relatedReport', 'region', 'emailSent', 'acknowledged', 'createdAt'],
    'treaties': ['id', 'name', 'countries', 'startDate', 'expiryDate', 'status', 'violationCount', 'documentUrl'],
    'satellite_images': ['id', 'imageUrl', 'region', 'lat', 'lng', 'uploadedBy', 'detectionStatus', 'objectDetectionResult', 'bufferZoneFlag', 'capturedAt'],
    'news': ['id', 'title', 'sourceUrl', 'content', 'submittedBy', 'verified', 'fakeNewsScore', 'sentimentScore', 'relatedRegion', 'createdAt'],
    'activities': ['id', 'actorId', 'action', 'targetType', 'targetId', 'description', 'timestamp'],
    'notifications': ['id', 'userId', 'type', 'message', 'read', 'link', 'createdAt']
  };

  for (let sheetName in schema) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    // Check if header row exists
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(schema[sheetName]);
      sheet.getRange(1, 1, 1, schema[sheetName].length).setFontWeight('bold').setBackground('#0B132B').setFontColor('#00F0FF');
    }
  }
  
  Logger.log('PeaceKeeper AI Database Schema setup complete.');
  return 'Database Schema Setup Complete!';
}

/**
 * Handle GET Requests (Reading Data)
 */
function doGet(e) {
  try {
    const params = e.parameter;
    const action = params.action || 'readAll';
    const sheetName = params.sheet;

    if (action === 'ping') {
      return jsonResponse({ status: 'ok', message: 'PeaceKeeper AI Apps Script Engine Active' });
    }

    if (!sheetName) {
      return jsonResponse({ success: false, message: 'Missing sheet parameter' }, 400);
    }

    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      return jsonResponse({ success: false, message: `Sheet '${sheetName}' not found` }, 404);
    }

    const data = getSheetDataAsObjects(sheet);

    if (action === 'readById' && params.id) {
      const item = data.find(row => String(row.id) === String(params.id));
      return jsonResponse({ success: true, data: item || null });
    }

    return jsonResponse({ success: true, count: data.length, data });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() }, 500);
  }
}

/**
 * Handle POST Requests (Create, Update, Delete)
 */
function doPost(e) {
  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else {
      payload = e.parameter;
    }

    const action = payload.action || 'create';
    const sheetName = payload.sheet;
    const data = payload.data || {};

    if (!sheetName) {
      return jsonResponse({ success: false, message: 'Missing sheet parameter' }, 400);
    }

    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      return jsonResponse({ success: false, message: `Sheet '${sheetName}' not found` }, 404);
    }

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // CREATE
    if (action === 'create') {
      if (!data.id) {
        data.id = `${sheetName.substring(0,3)}_${new Date().getTime()}`;
      }
      if (!data.createdAt) {
        data.createdAt = new Date().toISOString();
      }

      const rowValues = headers.map(h => data[h] !== undefined ? data[h] : '');
      sheet.appendRow(rowValues);

      return jsonResponse({ success: true, message: 'Record created', data });
    }

    // UPDATE BY ID
    if (action === 'update') {
      if (!data.id) {
        return jsonResponse({ success: false, message: 'Update requires record id' }, 400);
      }

      const allData = sheet.getDataRange().getValues();
      const idColIdx = headers.indexOf('id');

      let targetRowIndex = -1;
      for (let i = 1; i < allData.length; i++) {
        if (String(allData[i][idColIdx]) === String(data.id)) {
          targetRowIndex = i + 1; // 1-indexed
          break;
        }
      }

      if (targetRowIndex === -1) {
        return jsonResponse({ success: false, message: 'Record not found for update' }, 404);
      }

      const existingRow = allData[targetRowIndex - 1];
      const updatedRow = headers.map((h, colIdx) => {
        return data[h] !== undefined ? data[h] : existingRow[colIdx];
      });

      sheet.getRange(targetRowIndex, 1, 1, headers.length).setValues([updatedRow]);
      return jsonResponse({ success: true, message: 'Record updated', data });
    }

    // DELETE BY ID
    if (action === 'delete') {
      const idToDelete = data.id || payload.id;
      if (!idToDelete) {
        return jsonResponse({ success: false, message: 'Delete requires record id' }, 400);
      }

      const allData = sheet.getDataRange().getValues();
      const idColIdx = headers.indexOf('id');

      let targetRowIndex = -1;
      for (let i = 1; i < allData.length; i++) {
        if (String(allData[i][idColIdx]) === String(idToDelete)) {
          targetRowIndex = i + 1;
          break;
        }
      }

      if (targetRowIndex === -1) {
        return jsonResponse({ success: false, message: 'Record not found for deletion' }, 404);
      }

      sheet.deleteRow(targetRowIndex);
      return jsonResponse({ success: true, message: 'Record deleted', id: idToDelete });
    }

    return jsonResponse({ success: false, message: 'Invalid action specified' }, 400);
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() }, 500);
  }
}

/**
 * Helper: Map Sheet Data Rows to JavaScript Objects
 */
function getSheetDataAsObjects(sheet) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2) return [];

  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

/**
 * Standard JSON Response Builder
 */
function jsonResponse(data, status = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
