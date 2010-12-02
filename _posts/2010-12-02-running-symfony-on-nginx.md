---
layout: post
title: Running symfony on Nginx
disqus_uid: running-symfony-on-nginx
---
{{ page.title }}
================
A few days ago we published a website built using the [symfony php framework](http://www.symfony-project.org/).

We had some problems making symfony work correctly on nginx. In particular there were issues with url rewriting:
everything worked well for the frontend, but in the backend links to css and images were wrong.

We made a lot of googling and a lot trial and errors. The problem seems well know, but none of the solutions found online worked for us, so I've decided to write down our solution for future reference and for others who might have the same problem.

What worked for us was using two different virtual servers: one for the frontend and one for the backend.

We defined a virtual server named (e.g. www.example.com) with a configuration that looks more or less like this:
{% highlight nginx linenos %}
server {
  listen   80;
  server_name  www.example.com;

  access_log  /var/log/nginx/example.com.access.log;
  error_log   /var/log/nginx/example.com.error.log warn;

  root        /var/www/example.com/web;
  index       index.php;
  charset utf-8;

  location / {
    # If file exists as is static serve it directly
    if (-f $request_filename) {
      expires max; 
      break; 
    }
    if ($request_filename !~ "\.(js|ico|gif|jpg|png|css)$") {
      rewrite ^(.*) /index.php last;
    }
  }

  location ~ \.php($|/) {
    set  $script     $uri;
    set  $path_info  "";
    if ($uri ~ "^(.+\.php)($|/)") {
      set $script $1;
    }
    if ($uri ~ "^(.+\.php)(/.+)") {
      set  $script     $1;
      set  $path_info  $2;
    }

    fastcgi_pass   127.0.0.1:9000;

    include /etc/nginx/fastcgi_params;

    fastcgi_param  SCRIPT_FILENAME  /var/www/example.com/web$script;
    fastcgi_param  PATH_INFO        $path_info;
  }
}
{% endhighlight %}

And another one (e.g. admin.example.com) for the backend.
admin.example.com looks exactly the same, except the index.php is replaced with backend.php.
{% highlight nginx linenos %}
server {
  listen   80;
  server_name  admin.example.com;

  access_log  /var/log/nginx/example.com.access.log;
  error_log   /var/log/nginx/example.com.error.log warn;

  root        /var/www/example.com/web;
  index       backend.php;
  charset utf-8;

  location / {
    # If file exists as is static serve it directly
    if (-f $request_filename) {
      expires max; 
      break; 
    }
    if ($request_filename !~ "\.(js|ico|gif|jpg|png|css)$") {
      rewrite ^(.*) /backend.php last;
    }
  }

  location ~ \.php($|/) {
    set  $script     $uri;
    set  $path_info  "";
    if ($uri ~ "^(.+\.php)($|/)") {
      set $script $1;
    }
    if ($uri ~ "^(.+\.php)(/.+)") {
      set  $script     $1;
      set  $path_info  $2;
    }

    fastcgi_pass   127.0.0.1:9000;

    include /etc/nginx/fastcgi_params;

    fastcgi_param  SCRIPT_FILENAME  /var/www/example.com/web$script;
    fastcgi_param  PATH_INFO        $path_info;
  }
}
{% endhighlight %}

