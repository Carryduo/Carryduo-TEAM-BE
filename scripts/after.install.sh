#!/bin/bash
sudo chmod -R 777 /home/ubuntu/build
#navigate into our working directory
cd /home/ubuntu/build
sudo chmod +x /home/ubuntu/build/build.sh 
source build.sh
echo 'commit id: #{SourceVariables.CommitId} '
COMMIT_ID=#{SourceVariables.CommitId}
sudo aws logs create-log-stream --log-group-name carryduo --log-stream-name $COMMIT_ID --region ap-northeast-2

#install node modules & update swagger & pm2 reload
sudo pm2 reload ecosystem.json