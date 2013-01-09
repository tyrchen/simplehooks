
/*
 * github hook processing
 */
var fs = require('fs');
var spawn = require('child_process').spawn;
var _ = require('underscore');

var repos = [
    {name: 'cayman', ref: 'master', action: deploy},
    {name: 'cayman', ref: 'live', action: log},
    {name: 'barr', ref: 'master', action: deploy}

];


function deploy(repo, ref, data) {
    var name = 'github_' + repo + '_' + ref;
    var path = '/home/dev/bin/';
    //var path = '/Users/tchen/bin/';
    var cmd = path + name;
    spawn(cmd);
    console.log('deploy:', repo, ref, ' spawn', cmd);
}

function log(repo, ref, data) {
    var info = '\n\nInfo for ' + repo + ': ' + ref + ':\n';
    if (typeof data === 'object') {
        info += JSON.stringify(data) + '\n\n';
    } else {
        info += data + '\n\n';
    }
    fs.appendFile('/tmp/github_' + repo + '_' + ref, info, function(err) {});
}


exports.githubhook = function(req, res){
    var payload;
    req.connection.setTimeout(5000 * 60);
    if (typeof req.body.payload === 'object') {
        payload = req.body.payload;
    } else {
        payload = JSON.parse(req.body.payload);
    }

    _.each(repos, function(repo) {
        console.log(payload.repository.name, payload.ref, repo.name, repo.ref);
        if(repo.name === payload.repository.name && payload.ref.indexOf(repo.ref) >= 0) {
            repo.action(repo.name, repo.ref, payload);
        }
        res.send('ok');
    });
};