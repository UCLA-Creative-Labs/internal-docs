var fs = require('fs');
var path = require('path');
const {google} = require('googleapis');

/* Write _redirect file */
const sheets = google.sheets({version: 'v4', auth: `${process.env.AUTHORIZE_SHEETS_API_KEY}`});
sheets.spreadsheets.values.get({
  spreadsheetId: '11UPoREQxLhipshR4jXAGFuYfGen0WairLoxYvV9p1u4',
  range: 'Link!A:B',
}).then((response) => formatResponse(response));

function formatResponse(response){
  const values = response.data.values;
  if (!values) return;
  const labels = values[0];
  const links = values.slice(1).map((row) => {
    const link = {};
    labels.map((l, i) => {
      link[l] = row[i];
    });
    return link;
  });
  const redirects = links.reduce((acc, el) => `${acc}/${el.subdir} ${el.redirect}\n`,'')
              + '/* / 200';
  fs.writeFileSync(path.resolve(__dirname, '../dist/_redirects'), redirects);
}
