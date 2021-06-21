# install docker

For this, we are going to use the docker script :
 
`curl https://get.docker.com/ > install_docker.sh`

Verify it works :

`sudo docker run hello-world`

# run HA in a docker container 

`docker run --init -d \
  --name homeassistant \
  --restart=unless-stopped \
  -v /etc/localtime:/etc/localtime:ro \
  -v /PATH_TO_YOUR_CONFIG:/config \
  --network=host \
  homeassistant/raspberrypi4-homeassistant:stable`  

