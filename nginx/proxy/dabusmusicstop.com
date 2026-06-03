# Proxy nginx (192.168.2.20) — dabusmusicstop.com
# Stage 1 (pre-SSL): HTTP only, proxy to 192.168.2.22:8080
# Stage 2: run certbot — it will add SSL blocks automatically:
#   sudo certbot --nginx -d dabusmusicstop.com -d www.dabusmusicstop.com

server {
    server_name dabusmusicstop.com www.dabusmusicstop.com;

    access_log /var/log/nginx/dabusmusicstop.com.access.log;
    error_log  /var/log/nginx/dabusmusicstop.com.error.log;

    location / {
        proxy_pass         http://192.168.2.22:8080;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/dabusmusicstop.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/dabusmusicstop.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}


server {
    if ($host = www.dabusmusicstop.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = dabusmusicstop.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name dabusmusicstop.com www.dabusmusicstop.com;
    return 404; # managed by Certbot




}