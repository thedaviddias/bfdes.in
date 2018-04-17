# ----
title: Webserver setup for Ubuntu 16.04 on Digital Ocean
tags: Linux
created: 2018-04-12
# ----

Comprehensive documentation to secure a Digital Ocean machine ('Droplet'), and prepare it to serve a domain.

## SSH

We disable root login and only allow login to a new user using SSH keys.
- username/password logins are open to attack
- root user can make broad changes

### Create a new user

SSH into the machine:

```
ssh root@<SERVER_IP>
```

You will be prompted for root authentication, by password usually.

Create a new user and add it to the sudo group.

```
adduser <USERNAME>
gpasswd -a <USERNAME> sudo
```

### Add your SSH key

**Back on the client** we generate an SSH key-pair (if we do not already have one), and then transfer the public key to the server:

Copy the public key, usually kept at ```~/.ssh/id_rsa.pub```, to your clipboard.

**On the server** create an SSH profile for the new user.

```
su - <USERNAME>
mkdir ~/.ssh
chmod 700 ~/.ssh
```
Create a file called ```authorized_keys``` under this directory and paste your key into it. Then restrict the permissions of the file.

```
chmod 600 ~/.ssh/authorized_keys
exit
```

### Disable password authentication

Before attempting to disable password authentication verify that you can login to the server with your ssh credentials!

```
ssh <USERNAME>@<SERVER_IP>
```

After that is done edit the SSH daemon configuration, usually kept at ```etc/ssh/sshd_config```, **on the server** with sudo privileges.

Ensure following key-value pairs are present:

```
PasswordAuthentication no
PubkeyAuthentication yes
ChallengeResponseAuthentication no
```

You may also want to change the default SSH port to mitigate against brute force attacks (security through obscurity).

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

We will use Digital Ocean's Cloud Firewall service to create rules that limit traffic to the machine. Unlike approaches which involve modifying IP tables this method will not consume system resources. It will however mean we cannot implement protection through port knocking.

Create the following inbound rules on the dashboard:
1. one to permit HTTPS traffic,
2. another to permit HTTP traffic (optional),
3. and another to permit TCP connections through the SSH port configured above.

## Purchase a domain

Now is a good time to purchase a domain and point it to your machine's IPs.

On Google Domains basic DNS records could look like:

| Name | Type  | TTL  | Data           |
| :--- | :---- | :--- | :------------- |
| @    | A     | 1h   | &lt;IPv4&gt;   |
| @    | AAA   | 1h   | &lt;IPv6&gt;   |
| www  | CNAME | 1h   | &lt;DOMAIN&gt; |

## Web server

Install NGINX webserver (another sensible option is Caddy).

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

Update the default config, usually kept at ```/etc/nginx/sites-available/default```, with the domain name.

```
...
sever_name <DOMAIN> www.<DOMAIN>
...

# Verify the changes have taken effect
curl -Is <DOMAIN> | head -n 1
```

If the server does not reload automatically then run ```sudo systemctl reload nginx```.

## SSL

We will use Let's Encrypt certificate authority, which provides free SSL certificates to compatible clients.

We will use the default client Certbot, which is included with Ubuntu and integrates well with Nginx.

Update Certbot and it's Nginx plugin.
```
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update

sudo apt-get install python-certbot-nginx
```

Use the plugin to reconfigure Nginx and enable automatic certificate renewal.

```
sudo certbot --nginx -d <DOMAIN> -d www.<DOMAIN>
```

Using your browser verify that traffic is encrypted, you may also wish to check that HTTP requests are promoted to HTTPS if this is enabled.

Verify that Cerbot is correctly renewing certificates.

```
sudo certbot renew --dry-run
```

If you are using Digital Ocean now would be a good time to power down the Droplet and create a snapshot.

```
sudo poweroff
```

## References

An article by my friend, outlining very similar steps he took:
- [Securing an Ubuntu droplet, by Adil Parvez](https://blog.adilparvez.com/post/2016/06/30/1/server-setup.html)

Digital Ocean community articles:
- [Setting up an Ubuntu droplet](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04)
- [Setting up Nginx](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04)
- [Notes on Let's Encrypt](https://www.digitalocean.com/community/tutorials/an-introduction-to-let-s-encrypt)
- [Securing Nginx with Let's Encrypt](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04)