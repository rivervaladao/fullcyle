const mysql = require('mysql2');
const express = require('express');
const app = express();
const env = process.env;

// Create a connection to the database
const pool = mysql.createPool({
  host: env.DB_HOST || 'mysql',
  user: env.DB_USER || 'root',
  password: env.DB_PASSWORD || 'root',
  database: env.DB_NAME || 'persons',
  waitForConnections: true,
  connectionLimit: env.DB_CONN_LIMIT || 2,
  queueLimit: 0,
  debug: env.DB_DEBUG || false
});

console.debug(env.DB_HOST);

async function query(sql, params) {
  const [rows, fields] = await pool.promise().execute(sql, params);

  return rows;
}

// Insert a new row into the 'names' table
['Alfa','Beta','Gama','Teta'].forEach(async (name) => await query('INSERT INTO names (name) VALUES (?)', [name]));


app.get('/', async (req, res) => {
  var rows = await query('SELECT * FROM names');
  
  console.log('Selected rows:', rows);

	var template='<html><body><h2>Fullcycle Rocks!!!</h2><table><th>Names</th>'; 
  rows.forEach( (record, index ) => {
		  template+='<tr><td>'+record.name +'</td></tr>';
	});
  template+='</table></body></html>';

	res.send(template);
  pool.end();

});

app.listen(env.HTTP_PORT|3000, () => console.log('Server ready'));
