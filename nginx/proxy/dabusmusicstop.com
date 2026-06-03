# Proxy nginx (192.168.2.20) — dabusmusicstop.com
# Stage 1 (pre-SSL): HTTP only, proxy to 192.168.2.22:8080
# Stage 2: run certbot — it will add SSL blocks automatically:
#   sudo certbot --nginx -d dabusmusicstop.com -d www.dabusmusicstop.com

server {
    listen 80;
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
}
