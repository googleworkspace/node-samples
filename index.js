/**
 * Exports all quickstarts.
 */
module.exports = {
  quickstart: {
    // Format {service}_{version}, like the Node client.
    // @see https://github.com/googleapis/google-api-nodejs-client/tree/master/src/apis
    admin_directory_v1: require('./adminSDK/directory'),
    admin_reports_v1: require('./adminSDK/reports'),
    reseller_v1: require('./adminSDK/reseller'),
    script_v1: require('./apps-script/quickstart'),
    calendar_v3: require('./calendar/quickstart'),
    classroom_v1: require('./classroom/quickstart'),
    docs_v1: require('./docs/quickstart'),
    drive_v3: require('./drive/quickstart'),
    appsactivity_v1: require('./drive/activity'),
    appsactivity_v2: require('./drive/activity-v2'),
    gmail_v1: require('./gmail/quickstart'),
    people_v1: require('./people/quickstart'),
    sheets_v4: require('./sheets/quickstart'),
    slides_v1: require('./slides/quickstart'),
    tasks_v1: require('./tasks/quickstart'),
  },
};
