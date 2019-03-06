/**
 * Created by anth on 21.05.2017.
 */

const {Buffer} = require('buffer');
const zlib = require('zlib');


const toExport = {
  /**
   * Parse blueprint string in .15 format
   * @param str blueprint string to parse
   * @returns {Object} Factorio blueprint object
   */
  decode: {
    0: (str) => { // Version 0
      let data = null;
      try {
        data = JSON.parse(zlib.inflateSync(Buffer.from(str.slice(1), 'base64')).toString('utf8'));
      } catch (e) {
        throw e;
      }

      return data;
    },
    latest: null
  },

  /**
   * Encode an arbitrary object
   * @param obj
   * @returns {string} object encoded in Factorio .15 format
   */
  encode: {
    0: (obj) => { // Version 0
      return '0' + zlib.deflateSync(JSON.stringify(obj)).toString('base64');
    },
    latest: null
  }
};

toExport.decode.latest = toExport.decode[0];
toExport.encode.latest = toExport.encode[0];

module.exports = toExport;
