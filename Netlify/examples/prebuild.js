var fs = require('fs');
var path = require('path');
const {google} = require('googleapis');

/* Write .env file */
process.stdout.write('Writing to dotenv file .. ');
fs.writeFileSync(path.resolve(__dirname, '../.env'), `SHEETS_API_KEY=${process.env.SHEETS_API_KEY}`);
process.stdout.write('done\n');

/* Write cache file */
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
  fs.writeFileSync(path.resolve(__dirname, '../src/assets/cache.json'), JSON.stringify(links));
}