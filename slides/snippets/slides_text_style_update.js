// [START slides_text_style_update]
/**
 * Updates text style for a specific presentation's shape ID.
 * @param {string} presentationId The presentation ID.
 * @param {string} shapeId The shape ID.
 */
async function textStyleUpdate(presentationId, shapeId) {
  // Update the text style so that the first 5 characters are bolded
  // and italicized, the next 5 are displayed in blue 14 pt Times
  // New Roman font, and the next 5 are hyperlinked.
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth(
      {scopes: 'https://www.googleapis.com/auth/presentations'});

  const service = google.slides({version: 'v1', auth});

  const requests = [{
    updateTextStyle: {
      objectId: shapeId,
      textRange: {
        type: 'FIXED_RANGE',
        startIndex: 0,
        endIndex: 5,
      },
      style: {
        bold: true,
        italic: true,
      },
      fields: 'bold,italic',
    },
  }, {
    updateTextStyle: {
      objectId: shapeId,
      textRange: {
        type: 'FIXED_RANGE',
        startIndex: 5,
        endIndex: 10,
      },
      style: {
        fontFamily: 'Times New Roman',
        fontSize: {
          magnitude: 14,
          unit: 'PT',
        },
        foregroundColor: {
          opaqueColor: {
            rgbColor: {
              blue: 1.0,
              green: 0.0,
              red: 0.0,
            },
          },
        },
      },
      fields: 'foregroundColor,fontFamily,fontSize',
    },
  }, {
    updateTextStyle: {
      objectId: shapeId,
      textRange: {
        type: 'FIXED_RANGE',
        startIndex: 10,
        endIndex: 15,
      },
      style: {
        link: {
          url: 'www.example.com',
        },
      },
      fields: 'link',
    },
  }];

  // Execute the requests.
  try {
    const batchUpdateResponse = await service.presentations.batchUpdate({
      presentationId,
      resource: {
        requests,
      },
    });
    console.log(`Updated the text style for shape with ID: ${shapeId}`);
    return batchUpdateResponse.data;
  } catch (err) {
    // TODO (developer) - Handle exceptions
    throw err;
  }
}
// [END slides_text_style_update]

module.exports = {textStyleUpdate};