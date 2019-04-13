const os = require('os');
const pm2 = require('pm2');
 
function getMetrics(callback) {
  
    pm2.connect(function(err) {
        if (err) {
            console.error(err)        
        }
        pm2.list(function (error, processDescriptionList) {
            const metrics = processDescriptionList.map((p) => {
                return {
                    full_name: p.name + '-' + p.pm_id,
                    name: p.name,
                    pm_id: p.pm_id,
                    status: p.pm2_env.status,
                    memory: p.monit.memory,
                    cpu: p.monit.cpu / 100,
                    restart_times: p.pm2_env.restart_time,
                    unstable_restart: p.pm2_env.unstable_restarts,
                    uptime: new Date(p.pm2_env.pm_uptime),
                    uptime_duration: Date.now() - p.pm2_env.pm_uptime,
                    hostname: os.hostname()
                }
            })
            pm2.disconnect();
            callback(null, metrics);
        })
    })
}
 
module.exports.getMetrics = getMetrics;
