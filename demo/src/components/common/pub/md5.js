module.exports = function(str){
    const crypto = require('crypto');
    return crypto.createHash('md5').update(str).digest('hex');
}
