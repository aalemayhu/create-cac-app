FROM node

WORKDIR /usr/src/create-cac-app
COPY packages/cli/ ./
RUN npm install -g $(npm pack /usr/src/create-cac-app | tail -1)
RUN git clone https://github.com/vuejs/vue /usr/src/vue
ENTRYPOINT "/bin/bash"
