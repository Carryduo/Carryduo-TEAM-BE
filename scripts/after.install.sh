#!/bin/bash
sudo chmod -R 777 /home/ubuntu/build

#navigate into our working directory
cd /home/ubuntu/build
sudo npm install
#install node modules & update swagger & pm2 reload
sudo pm2 reload carryduo