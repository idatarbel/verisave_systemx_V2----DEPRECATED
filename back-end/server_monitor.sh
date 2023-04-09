ROOT_PATH=/home/ec2-user/verisave_systemx/back-end
EXECUTION_LOG=${ROOT_PATH}/logs/execution.log
cd ${ROOT_PATH}
date >> ${EXECUTION_LOG}
echo "STARTING SERVER PROCESS" >> ${EXECUTION_LOG}
until npm start >> ${EXECUTION_LOG}; do
    date >>  ${EXECUTION_LOG}
    echo "Server 'back-end' crashed with exit code $?.  Respawning.."  ${EXECUTION_LOG}
    echo "Server 'back-end' crashed with exit code $?.  Respawning.." >&2
    sleep 1
done
date >>  ${EXECUTION_LOG}
