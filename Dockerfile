FROM nginx:alpine

COPY index.html               /usr/share/nginx/html/index.html
COPY resultados.html          /usr/share/nginx/html/resultados.html
COPY registro-solidaridad.html /usr/share/nginx/html/registro-solidaridad.html
COPY survey_stats.json        /usr/share/nginx/html/survey_stats.json
COPY css/                     /usr/share/nginx/html/css/
COPY js/                      /usr/share/nginx/html/js/
COPY public/                  /usr/share/nginx/html/public/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
