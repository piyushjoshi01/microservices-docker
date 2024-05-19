
FROM node:latest

# Use production node environment by default.
ENV NODE_ENV production


WORKDIR /app


# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install


# Copy the rest of the source files into the image.
COPY . .



EXPOSE 6000

# Run the application.
CMD ["node", "server.js"]
