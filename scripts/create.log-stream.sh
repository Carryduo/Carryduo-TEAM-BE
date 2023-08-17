source ./build.env

sudo aws logs create-log-stream --log-group-name carryduo --log-stream-name $CODEBUILD_RESOLVED_SOURCE_VERSION