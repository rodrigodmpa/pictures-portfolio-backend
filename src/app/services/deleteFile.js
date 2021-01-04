/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

function deleteFile({ pathStartingWithTmp }) {
  const fullPath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    ...pathStartingWithTmp
  );
  fs.unlinkSync(fullPath, (err2) => {
    if (err2) throw new Error(err2);
    return 1;
  });
  // fs.statSync(fullPath, (err1, stats) => {
  //   console.log(stats); // here we got all information of file in stats variable

  //   if (err1) {
  //     throw new Error(err1);
  //   }

  //   fs.unlinkSync(fullPath, (err2) => {
  //     if (err2) throw new Error(err2);
  //     return 1;
  //   });
  //   return 1;
  // });

  return 1;
}

export default deleteFile;
