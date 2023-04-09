front_end_processes=`ps -aef | grep "node /bin/serve -s build -n" | grep -v "grep" | wc -l`
date
echo "PROCESSES FOUND: " ${front_end_processes}
if test ${front_end_processes} = "0"
then
	date
	echo "Restarting front end..."
	cd /home/ec2-user/verisave_systemx/front-end 
	sudo serve -s build -n &
	date
	echo "Front end restarted!"
else
	date
	echo "Front end running"
fi
