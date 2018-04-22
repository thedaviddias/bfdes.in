# ----
title: Provisioning a Digital Ocean Droplet
tags: Linux
created: 2018-04-12
# ----

Comprehensive documentation to secure a Digital Ocean Ubuntu 16.04 'Droplet', and prepare it to serve a domain.

## SSH

We disable root login and only allow login to a new user using SSH keys.
- username/password logins are open to attack
- root user can make broad changes

### Create a new user

SSH into the machine:

```
ssh root@<SERVER_IP>
```

You will be prompted for root authentication, by password usually, unless your ssh key is known to Digital Ocean.

Create a new user and add it to the sudo group.

```
adduser <USERNAME>
gpasswd -a <USERNAME> sudo
```

### Add your SSH key

**Back on the client** we generate an SSH key-pair (if we do not already have one), and then transfer the public key to the server:

Copy the public key, usually kept at `~/.ssh/id_rsa.pub`, to your clipboard.

**On the server** create an SSH profile for the new user.

```
su - <USERNAME>
mkdir ~/.ssh
chmod 700 ~/.ssh
```
Create a file called `authorized_keys` under this directory and paste your key into it. Then restrict the permissions of the file.

```
chmod 600 ~/.ssh/authorized_keys
```

### Disable password authentication

Before attempting to disable password authentication verify that you can login to the server with your ssh credentials!

```
ssh <USERNAME>@<SERVER_IP>
```

After that is done edit the SSH daemon configuration, usually kept at `etc/ssh/sshd_config`, **on the server** with sudo privileges.

Ensure following key-value pairs are present:

```
PermitRootLogin no
PubkeyAuthentication yes
ChallengeResponseAuthentication no
PasswordAuthentication no
```

You may also want to change the default SSH port to mitigate against brute force attacks (security through obscurity) and keep a clean log file.

Ensure it is a port that can only be opened by a privileged user (i.e. one below 1024). Credit to [Daniel Li](http://danyll.com/) for this point.

```
Port <SSH_PORT>
```

Reload the SSH daemon.

```
sudo systemctl reload sshd
```

If you changed the SSH port you must now specify that port when connecting.

```
ssh <USERNAME>@<SERVER_IP> -p <SSH_PORT>
```

## Firewall

*The rest of this section will assume you working with a DO Droplet.*

We will use Digital Ocean's Cloud Firewall service to create rules that limit traffic to the machine.

Unlike approaches which involve modifying IP tables this method will not consume system resources.

It will however mean we cannot implement protection through port knocking.

Create the following inbound rules on the dashboard:
1. one to permit HTTPS traffic,
2. another to permit HTTP traffic (optional),
3. and another to permit TCP connections through the SSH port configured above.

If you are using Digital Ocean now would be a good time to power down the Droplet and create a snapshot.

```
sudo poweroff
```

## Port knocking

Changing the SSH port will not stop a determined attacker from finding it by a port scan.

Pork knocking involves having a total firewall and only opening a port to an IP in response to the correct sequence of port 'knocks'.

Take a look at [kockd](http://www.zeroflux.org/projects/knock), or if you want something more secure [knockknock](https://moxie.org/software/knockknock/) and [fwknop](http://www.cipherdyne.org/fwknop/).  

## Purchase a domain

Now is a good time to purchase a domain from a registrar and point it to your machine's IPs by setting DNS records.

For example, basic DNS records as set on Google Domains look like:

| Name | Type  | TTL  | Data           |
| :--- | :---- | :--- | :------------- |
| @    | A     | 1h   | &lt;IPv4&gt;   |
| @    | AAA   | 1h   | &lt;IPv6&gt;   |
| www  | CNAME | 1h   | &lt;DOMAIN&gt; |

Note that it might take a while for your own ISP's DNS servers to be updated with the mapping.

## Web server

Install nginx webserver (another sensible option is Caddy), e.g. from the Ubuntu PPA.

```
sudo apt-get update
sudo apt-get install nginx
```

Verify the server is running.

```
systlemctl status nginx

# And on the client
curl -Is <SERVER_IP> | head -n 1
```

Supply a site configuration file.

```
sudo touch /etc/nginx/conf.d/<DOMAIN>.conf
```

Example configuration for a server that serves static files and proxies an application server on 8080:

```
server {
  listen 80 default_server;
  listen [::]:80 default_server;
  server_name <DOMAIN> www.<DOMAIN>;
  root /var/www/<DOMAIN>;

  location /static {
    # First attempt to serve request as file, then
    # as directory, then fall back to a 404.
    try_files $uri $uri/ =404;
  }

  location / {
    proxy_pass http://localhost:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

Remove the symlink to the default configuration file from `/etc/nginx/sites-enabled`. It is available for reference in `/etc/nginx/sites-available`.

Check the vailidity of your nginx configuration.

```
sudo nginx -t
```

Make the root folder if you haven't already.

```
cd /var/wwww
sudo mkdir <DOMAIN>
sudo chgrp www-data bfdes.in # Change permissions group to one that nginx uses
```

You can use `scp` to move assets and application code to the server.

```
scp -P <SSH_PORT> </PATH/TO/FILE> <USERNAME>@<SERVER_IP>:</PATH/TO/DEST>
```

Setup your application to run if necessary and ensure it restarts when the server boots, perhaps by installing a crontab.

If the server does not reload automatically run `sudo nginx -s reload`.

## SSL

Enable HTTPS encryption by downloading an installing a (free) certificate from the Let's Encrypt certificate authority.

Download and install the certbot client by Let's Encrypt.

```
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot
```

### Configure Nginx

Modify the server block created earlier to allow the CA to fulfil the ACME challenge.

```
...
location /.well-known/acme-challenge {
  try_files $uri $uri/ =404;
}
...
```

Ask Certbot to carry out the HTTP challenge and issue the certificate.

```
sudo certbot certonly --webroot -w /var/www/<DOMAIN> -d www.<DOMAIN> -d <DOMAIN>
```

Successful authentication results in the client creating two files:

- The certficate at `/etc/letsencrypt/live/www.<DOMAIN>/fullchain.pem`
- The key file at `/etc/letsencrypt/live/www.<DOMAIN>/privkey.pem`

Point nginx to the certificate by modifying your site configuration file.

```
server {
  listen 80 default_server;
  listen [::]:80 default_server;
  server_name <DOMAIN> www.<DOMAIN>;

  location /.well-known/acme-challenge {
    try_files $uri $uri/ =404;
  }

  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl default_server;
  listen [::]:443 ssl default_server;
  server_name <DOMAIN> www.<DOMAIN>;
  ssl_certificate /etc/letsencrypt/live/<DOMAIN>/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/www.<DOMAIN>/privkey.pem;
  root /var/www/<DOMAIN>;
  gzip on; # DO NOT use with SSL when serving sensitive data

  location /static {
    try_files $uri $uri/ =404;
  }

  location / {
    ...
    # As before
    ...
  }
}
```

Using your browser verify that traffic is encrypted, you may also wish to check that HTTP requests are promoted to HTTPS.

Install a crontab to renew the certificate at least once every three months.

```
sudo crontab -e # Use the root's crontab
# Then add this line to the file
0 0 1 JAN,MAR,MAY,JUL,SEP,NOV * /usr/bin/certbot renew --quiet 
```

This is another good time to backup the Droplet.

### Certbot plugin for Nginx

An alternative approach is to use the nginx plugin provided by certbot to automate the renewal process.

Use the plugin to reconfigure Nginx and enable automatic certificate renewal.

```
# After installing certbot
sudo apt-get install python-certbot-nginx
sudo certbot --nginx -d <DOMAIN> -d www.<DOMAIN>
```

You should find that your site configuration file has been modified by certbot.

## References

An article by my friend, outlining very similar steps he took:
- [Securing an Ubuntu droplet](https://blog.adilparvez.com/post/2016/06/30/1/server-setup.html), by Adil Parvez

Vendor articles:
- [Setting up an Ubuntu droplet](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04)
- [Securing Nginx with Let's Encrypt](https://www.nginx.com/blog/free-certificates-lets-encrypt-and-nginx/)
