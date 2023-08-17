sudo chmod -R 777 /home/ubuntu/build
sudo chmod +x /home/ubunut/build/build.sh 
cd /home/ubuntu/build
source build.sh
echo 'commit id' $CODEBUILD_RESOLVED_SOURCE_VERSION
sudo aws logs create-log-stream --log-group-name carryduo --log-stream-name $CODEBUILD_RESOLVED_SOURCE_VERSION