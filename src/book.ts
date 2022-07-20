/**
 * Created by anth on 21.05.2017.
 */

import Blueprint, { BlueprintOptions } from './index';
import util from './util';

export default (str: string, opt?: BlueprintOptions) => {
  const version = str.slice(0, 1);
  if (version !== '0') {
    throw new Error(
      'Cannot find decoder for blueprint book version ' + version,
    );
  }
  let obj = util.decode[version](str);

  const blueprints = obj.blueprint_book.blueprints;
  const blueprintList: Blueprint[] = [];

  blueprints.forEach((data: any) => {
    const blueprintData = data.blueprint;

    if (data.index === undefined) {
      blueprintList.push(new Blueprint(blueprintData, opt));
    } else {
      blueprintList[data.index] = new Blueprint(blueprintData, opt);
    }
  });

  return blueprintList;
};
