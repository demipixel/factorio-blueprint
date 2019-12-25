/**
 * Created by anth on 21.05.2017.
 */

import { Buffer } from 'buffer';
import * as zlib from 'zlib';

const toExport = {
  /**
   * Parse blueprint string in .15 format
   * @param str blueprint string to parse
   * @returns {Object} Factorio blueprint object
   */
  decode: {
    0: (str: string) => {
      // Version 0
      let data: any = null;
      try {
        data = JSON.parse(
          zlib
            .inflateSync(Buffer.from(str.slice(1), 'base64'))
            .toString('utf8'),
        );
      } catch (e) {
        throw e;
      }

      return data;
    },
    latest: (str: string) => ({} as any), // Set later
  },

  /**
   * Encode an arbitrary object
   * @param obj
   * @returns {string} object encoded in Factorio .15 format
   */
  encode: {
    0: (obj: any) => {
      // Version 0
      return '0' + zlib.deflateSync(JSON.stringify(obj)).toString('base64');
    },
    latest: (obj: any) => '', // Set later
  },
};

toExport.decode.latest = toExport.decode[0];
toExport.encode.latest = toExport.encode[0];

export default toExport;
