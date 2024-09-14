#!/bin/bash
export SPLUNK_HOME=/opt/splunk
export APP_DIR_NAME=departures-board-viz
export SPLUNK_APP_DIR_NAME=departures-board-viz

 bump=`cat $SPLUNK_HOME/var/run/splunk/push-version.txt`
 echo "Current version: $bump"
 let bump++
 echo -n $bump > $SPLUNK_HOME/var/run/splunk/push-version.txt
 echo "New version:  $bump"

cd /opt/git/$APP_DIR_NAME
git pull
cd /opt/git/$APP_DIR_NAME/appserver/static/visualizations/$SPLUNK_APP_DIR_NAME
npm run build
rm -rf /opt/splunk/etc/apps/$SPLUNK_APP_DIR_NAME
mkdir /opt/splunk/etc/apps/$SPLUNK_APP_DIR_NAME
cp -R /opt/git/$APP_DIR_NAME/* /opt/splunk/etc/apps/$SPLUNK_APP_DIR_NAME
# chown -R splunk:splunk /opt/splunk
# /opt/splunk/bin/splunk restart
cd /opt/git/$APP_DIR_NAME
python3 ./restart.py

