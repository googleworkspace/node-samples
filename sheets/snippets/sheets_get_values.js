const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');

const auth = new GoogleAuth(
  {scopes: 'https://www.googleapis.com/auth/spreadsheet'});

/**
 * Gets cell values from a Spreadsheet.
 * @param {Googleatuh} auth The google default authentiaction
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} range The sheet range.
 */
function getValues(auth, spreadsheetId, range) {
  // [START sheets_get_values]
  const service = google.sheets({version: 'v4', auth});
  service.spreadsheets.values.get({
    spreadsheetId,
    range,
  }, (err, result) => {
    if (err) {
      console.error('The API returned an error:' + err);
    } else {
      const numRows = result.data.values ? result.data.values.length : 0;
      console.log(`${numRows} rows retrieved.`);
      return result.values;
    }
  });
}
// [END sheets_get_values]
// TODO: reaplce the spreadsheetid with your spreadsheetid and your required
//  range
getValues(auth, '1SP6jdMywK6GhzKGHWOgAAZoJkGH2bdBKzOWT2GiacXA', 'A1:B2');
