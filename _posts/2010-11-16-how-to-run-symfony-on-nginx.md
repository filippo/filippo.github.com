---
layout: post
title: How to run php on nginx
disqus_uid: how-to-run-php-on-nginx
---

{{ page.title }}
================
Some months ago we started using Rackspace cloud servers and decided to use [Nginx](http://wiki.nginx.org/) to serve web pages.
Nginx is a really fast HTTP server with easy configuration and a rich feature set. 

Configuring Nginx to serve static content was really straightforward. Then we decided to add .php through fastcgi.

We used [this article](http://tomasz.sterna.tv/2009/04/php-fastcgi-with-nginx-on-ubuntu/) as a base to run a php FastCGI service and to configure Nginx to use the service for .php pages.

A nice feature in Nginx is the include directive which enables you to include any configuration file for whatever purpose you want. So we factored out the part relative to php pages in a seprate file. 

Something like: serve_php.conf
{% highlight nginx %}
fastcgi_index   index.php;

location ~ \.php {
    include /etc/nginx/fastcgi_params;
    keepalive_timeout 0;
    fastcgi_param   SCRIPT_FILENAME  $document_root$fastcgi_script_name;
    fastcgi_pass    127.0.0.1:9000;
    include        /etc/nginx/fastcgi_params;
}
{% endhighlight %}

Then when we want to enable php on a website we can simply include the serve_php.conf file.
Below is an example.com website serving php.
{% highlight nginx %}
server {
	listen   80;
	server_name  example.com  www.example.com;

	access_log  /var/log/nginx/example.com.access.log;
        error_log   /var/log/nginx/example.com.error.log warn;

        root        /var/www/example.com/public;
        index       index.php index.html;

	#serve php files
	include /etc/nginx/serve_php.conf;
}
{% endhighlight %}

