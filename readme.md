# Nginx Reverse Proxy Example

There are two web applications, working in their own docker containers (actually these are two instances of same docker image, but for this demo it isn't matter).
You can log in using any of two application. And cookie will be shared due to single entry point http://localhost:8080, provided by nginx.