# -------------> The build Image
FROM node:14 AS build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

# Bundle app source
COPY . .

RUN npx nuxt build

RUN npx nuxt generate

RUN yarn install --frozen-lockfile --production

# ---------------> The Production Image
FROM node:14-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app /usr/src/app

CMD [ "npx", "nuxt", "start" ]
