
# FROM node:lts AS development
# WORKDIR /app
# COPY package.json /app/package.json
# COPY package-lock.json /app/package-lock.json
# RUN npm install --legacy-peer-deps
# COPY . /app
# CMD [ "npm", "start" ]
# FROM development AS build
# RUN npm run build

FROM nginx:alpine
# COPY --from=build /app/build /usr/share/nginx/html
# WORKDIR /usr/share/nginx/html
# RUN rm /etc/nginx/conf.d/default.conf
# COPY default.conf /etc/nginx/conf.d

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]


