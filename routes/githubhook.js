
/*
 * github hook processing
 */
var fs = require('fs');

exports.githubhook = function(req, res){
    fs.writeFile('/tmp/github_post', JSON.stringify(req.body), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('file has been saved.');
        }
    })
    res.send('ok');
};