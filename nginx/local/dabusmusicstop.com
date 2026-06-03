# Local nginx (192.168.2.22) — static file backend for dabusmusicstop.com
# Deploy: sudo cp nginx/local/dabusmusicstop.com /etc/nginx/sites-available/dabusmusicstop.com
#         sudo ln -s /etc/nginx/sites-available/dabusmusicstop.com \
#                    /etc/nginx/sites-enabled/dabusmusicstop.com
#         sudo systemctl reload nginx

server {
    listen 8080;
    server_name dabusmusicstop.com www.dabusmusicstop.com;

    root /Server/dabusmusicstop.com;
    index index.html;

    access_log /var/log/nginx/dabusmusicstop.com.access.log;
    error_log  /var/log/nginx/dabusmusicstop.com.error.log;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    location / {
        try_files $uri $uri/ =404;
    }

    location ~* \.(jpg|jpeg|png|gif|svg|ico|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    location ~ /\.(git|gitignore) {
        deny all;
    }
}
