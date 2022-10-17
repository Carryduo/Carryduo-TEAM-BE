#!/bin/bash
sudo chmod -R 777 /home/ubuntu/build

#navigate into our working directory
cd /home/ubuntu/build

#install node modules & update swagger & pm2 reload
sudo npm ci
sudo npm run build
sudo pm2 reload carryduo