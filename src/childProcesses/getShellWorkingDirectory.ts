import sh from 'shelljs';

const result = sh.pwd().toString();
console.log(result);