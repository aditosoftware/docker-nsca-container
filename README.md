# Usage
With this image can you monitor a linked container(Ports only).

## Arguments

  Servername for Icinga configuration:
  
      - HOSTNAMEMONITORING=webservernr2
      
  Ports for monitoring      
      
      - PORTS=SSH:22;tomcat:8081;HTTP:80
      
  Displayname for a server    
      
      - DISPLAYNAME=WebServer Nr2
      
  DNS Name of monitoring server
      
      - MONITORING_SERVER=monitoring
      
  Password of NSCA Service
      
      - NSCAPASS=SDFasdfasdf3adf
      
  Name of container, witch you will monitor
      
      - HOSTINT=httpd
      
  After start the conainter, this will send following information on monitoring server
  
    webservernr2;Monitored_Services;2;ERROR - Service(s) tomcat(8081),SSH(22) not responding
    webservernr2;0;OK - Everything is going to be fine

Monitored_Serices - name of service

webserverrn2 - name of server

## Start container

    sudo docker run -v /vagrant:/vagrant -e HOSTNAMEMONITORING="webservernr2" --link monitoring:httpd \
    -e PORTS="SSH:22;TOMCAT:8081;HTTP:80" -e DISPLAYNAME="WebServer Nr" \
    -e MONITORING_SERVER="monitoring" -e NSCAPASS="SDFasdfasdf3adf" \
    -e HOSTINT="httpd" --name monitoring -t adito/nsca-monitoring
  
!!You need link a container TO monitoring
