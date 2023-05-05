const mysql = require('mysql2/promise');
const express = require('express');
const app = express();
const env = process.env;

// Create a connection to the database
const config ={
  host: env.DB_HOST || 'mysql',
  port: env.DB_PORT || '3306',
  user: env.DB_USER || 'root',
  password: env.DB_PASSWORD || 'root',
  database: env.DB_NAME || 'persons',
  waitForConnections: true,
  connectionLimit: env.DB_CONN_LIMIT || 2,
  queueLimit: 0,
  debug: env.DB_DEBUG || false
};

const pool = mysql.createPool(config);

// Check connection
pool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL server');    
    // Insert data
    ['Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'Isabelle', 'Jack']
    .forEach(async (name) => await
      connection.execute('INSERT INTO persons (name) VALUES (?)',[name])
      .then(result => {
        console.log('Inserted row:', result[0].affectedRows);
        connection.release();
      })
      .catch(error => {
        console.error('Error inserting row', error);
        connection.release();
      }));
    })
  .catch(error => console.error('Error getting connection from pool', error));

// Get connection from pool
const list = () =>
pool.getConnection()
  .then(connection => {
    // Select data
    return connection.execute('SELECT * FROM persons')
      .then(result => {
        console.log('Selected rows:', result[0]);
        return result[0];
      })
      .catch(error => {
        console.error('Error selecting rows', error);
        connection.release();
      });
  })
  .catch(error => console.error('Error getting connection from pool', error));

app.get('/', async (req, res) => {

  const rows = await list();

	let template='<html><body><h2>Fullcycle Rocks!!!</h2><table><th>Names</th>'; 

  rows.forEach( (record, index ) => {
		  template+='<tr><td>'+record.name +'</td></tr>';
	});

  template+='</table></body></html>';

	res.send(template)
});

app.listen(env.HTTP_PORT|3000, () => console.log('Server ready'));
