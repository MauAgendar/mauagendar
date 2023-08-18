FROM node as base

# Directory within the container
WORKDIR /app

# Copy application files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose the Node.js application port
ARG CALENDAR_PORT
ENV CALENDAR_PORT $CALENDAR_PORT
EXPOSE $CALENDAR_PORT

# Set the command to start the application
CMD ["npm", "start"]

