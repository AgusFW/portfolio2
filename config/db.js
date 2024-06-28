import {createPool} from 'mysql2/promise';

// Create a connection pool
const pool = createPool({
    host: 'ba5b8nln5ewe3auehpud-mysql.services.clever-cloud.com',
    user: 'uihbbs3tnqdf2i97',
    password: 'aUyNmx5TMF9QDzHnutEQ',
    database: 'ba5b8nln5ewe3auehpud',
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
});

pool.getConnection()
    .then(connection => {
        pool.releaseConnection(connection);
        console.log('Base de datos CONECTADA');
    })
    .catch(err => console.error('Error connecting to database', err));

export default pool;

/* emailJS: @werty16234 */