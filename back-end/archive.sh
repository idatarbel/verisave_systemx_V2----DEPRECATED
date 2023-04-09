cd /home/ec2-user/verisave_systemx/back-end/logs/
date
echo "Zipping restart.log and execution.log..."
gzip restart.log
gzip execution.log
ls -l 
dt=$(date '+%Y%m%d_%H%M%S');
echo "Creating tar file..."
tar -cvf logs.${dt}.tar *.gz
ls -l logs.${dt}.tar
rm *.gz
