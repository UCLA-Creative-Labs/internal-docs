# Pull from a base image
FROM node:14-alpine

# Copy the contents of the current directory to app/
COPY . app/

# Use app/ as the working directory to prevent any code manipulation
WORKDIR app/

# Install dependencies
# Sometimes I see npm ci --only-production but yarn install is fine
RUN yarn install

# Make sure to set the NODE_ENV to production
ENV NODE_ENV production

# Open access to port 300
EXPOSE 3000

# Unleash your server to the world
ENTRYPOINT yarn start