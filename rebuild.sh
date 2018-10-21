export SPLUNK_HOME=/opt/splunk
cd /opt/git/departures-board-viz
git pull
cd /opt/git/departures-board-viz/appserver/static/visualizations/departures-board-viz
npm run build
rm -r /opt/splunk/etc/apps/departures-board-viz
cp -R /opt/git/departures-board-viz/ /opt/splunk/etc/apps/
chown -R splunk:splunk /opt/splunk
/opt/splunk/bin/splunk restart

