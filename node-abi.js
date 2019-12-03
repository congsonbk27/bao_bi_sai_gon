const nodeabi = require('node-abi');

console.log(
  nodeabi.getAbi('12.8.1','node')
);

console.log(
  nodeabi.getAbi('6.0.6', 'electron')
);
