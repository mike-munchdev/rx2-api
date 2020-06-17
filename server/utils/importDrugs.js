const request = require('request-promise-native');
const JSZip = require('jszip');
const asyncForEach = require('./asyncForEach');
const Drug = require('../models/Drug');
const connectDatabase = require('../models/connectDatabase');

module.exports.importDrugs = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await connectDatabase();

      const uri = process.env.FDA_DRUG_FILE_URI;
      const fdaFileName = 'drug-ndc-0001-of-0001.json';

      console.log(`Getting ${uri}`);
      const fdaResponse = await request({
        method: 'GET',
        uri,
        encoding: null,
      });

      console.log(`Loading zip from ${uri}.`);
      const zip = await JSZip.loadAsync(fdaResponse);

      console.log(`Loading string from ${uri}.`);
      const drugs = await zip.file(fdaFileName).async('string');
      // // const drugs = require('./drug-ndc-0001-of-0001.json');
      console.log(`Parsing JSON from ${uri}.`);

      const { results } = JSON.parse(drugs);
      const activeDrugs = results.filter((d) => d.finished === true);
      console.log('Deleting old data.');

      console.log(`Adding ${activeDrugs.length} records.`);
      await asyncForEach(activeDrugs, async (drug, index, array) => {
        await Drug.findOneAndUpdate({ product_id: drug.product_id }, drug, {
          upsert: true,
        });
      });
      console.log('Done.');

      resolve();
    } catch (error) {
      console.log('Error loading drugs', error);
      reject(error);
    }
  });
};
