# Stage 1: Build the application
FROM node as build
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the built application
FROM node as production
WORKDIR /app

# Copy the built files from the previous stage
COPY --from=build /app/dist ./dist

# Install serve globally
RUN npm install -g serve

# Expose the application port
ARG CLIENT_PORT
ENV CLIENT_PORT $CLIENT_PORT
EXPOSE $CLIENT_PORT

ARG VITE_AUTH_PORT
ENV VITE_AUTH_PORT $VITE_AUTH_PORT

ARG VITE_CALENDAR_PORT
ENV VITE_CALENDAR_PORT $VITE_CALENDAR_PORT

# Set the command to serve the application
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:$CLIENT_PORT"]