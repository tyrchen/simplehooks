
/*
 * github hook processing
 */
var fs = require('fs');
var exec = require('child_process').exec;
var _ = require('underscore');

var repos = [
    {name: 'cayman', ref: 'master', action: deploy},
    {name: 'cayman', ref: 'live', action: log},
    {name: 'barr', ref: 'master', action: log}

];


function deploy(repo, ref, data) {
    console.log('deploy:', repo, ref);
    var cmd = 'nohup /home/dev/bin/github_' + repo + '_' + ref + ' &';
    exec(cmd, function(err, output) { log(repo, ref, data); console.log(err); });
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