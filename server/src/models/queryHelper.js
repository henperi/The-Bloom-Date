import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const envType = process.env.ENV_TYPE;

let databaseURL;
switch (envType) {
  case 'DEV':
    databaseURL = process.env.DEVELOPMENT_DATABASE_URL;
    break;

  case 'PROD':
    databaseURL = process.env.PRODUCTION_DATABASE_URL;
    break;

  default:
    databaseURL = process.env.DEVELOPMENT_DATABASE_URL;
    break;
}

const pool = new Pool({
  connectionString: databaseURL,
});

export default {
  /**
   * DB Query Helper
   * @param {string} queryText
   * @param {object} values
   * @returns {object || array}
   */
  query(text, params) {
    return new Promise((resolve, reject) => {
      pool
        .query(text, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
