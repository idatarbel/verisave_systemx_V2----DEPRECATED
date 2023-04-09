dt=$(date '+%Y%m%d_%H%M%S');
mv /home/ec2-user/verisave_systemx/front-end/logs/restart.log /home/ec2-user/verisave_systemx/front-end/logs/restart.${dt}.log
gzip /home/ec2-user/verisave_systemx/front-end/logs/restart.${dt}.log
