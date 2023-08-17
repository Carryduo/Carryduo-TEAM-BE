source build.env
echo $CODEBUILD_RESOLVED_SOURCE_VERSION
sudo aws logs create-log-stream --log-group-name carryduo --log-stream-name $CODEBUILD_RESOLVED_SOURCE_VERSION