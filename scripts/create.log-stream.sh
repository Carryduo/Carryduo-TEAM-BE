COMMIT_ID=$(git rev-parse HEAD)
export COMMIT_ID
aws logs create-log-stream --log-group-name carryduo --log-stream-name $COMMIT_ID