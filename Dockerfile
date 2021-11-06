# run `npm run build && cd frontend&&npm run build` before build the image
# docker 
FROM node:12.18.1
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY ./build ./build
COPY ./frontend/build/ ./frontend/build
CMD [ "node","/app/build/index.js" ]