#use the foolowing command to route port 80 to port 3000(first installation of server)
#because you cannot start a nodejs app on port 80 without root access
sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000