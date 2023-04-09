back_end_processes=`ps -aef | grep " /home/ec2-user/verisave_systemx/back-end/node_modules/babel-cli/lib/_babel-node ./server/server.js" | grep -v grep | wc -l`
date
echo "PROCESSES FOUND: " ${back_end_processes}
if test ${back_end_processes} = "0"
then
	date
	echo "Restarting back end..."
	cd /home/ec2-user/verisave_systemx/back-end 
	sudo npm start &
	date
	echo "Back end restarted!"
else
 	date
	echo "Back end running"
fi
