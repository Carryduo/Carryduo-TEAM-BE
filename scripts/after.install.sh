
echo ${COMMIT_ID}
#!/bin/bash
sudo chmod -R 777 /home/ubuntu/build
sudo chmod 400 /home/ubuntu/build/scripts/create.log-stream.sh
#navigate into our working directory
cd /home/ubuntu/build

sudo ./scripts/create.log-stream.sh

#install node modules & update swagger & pm2 reload
sudo pm2 reload carryduo