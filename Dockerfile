# Stage 1
FROM node:8 as react-build

# use MapboxAccessToken for build
ARG MapboxAccessToken
ENV MapboxAccessToken=$MapboxAccessToken

WORKDIR /app
COPY . ./
RUN yarn
RUN yarn build

# Stage 2 - the production environment
FROM nginx:alpine
COPY --from=react-build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]