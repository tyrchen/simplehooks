var kue = require('kue')
    , jobs = kue.createQueue()
    ,exec = require('child_process').exec;

jobs.process('deploy', function(job, done){
    console.log('working on a deploy job', job.data.command);
    exec(job.data.command, function(err, output) {
        console.log('job done', err);
        done();
    });
});