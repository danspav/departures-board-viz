export SPLUNK_HOME=/opt/splunk
cd /opt/splunk/etc/apps/airport-text-viz
git pull
cd appserver/static/visualizations/airport-text-viz
npm run build
/opt/splunk/bin/splunk restart

