FROM node:20-slim

# Prepare Work Directory
RUN mkdir -p /home/direviu/app
WORKDIR /home/direviu/app
COPY --chown=direviu:direviu . .

# Preparation Submission Folder
RUN mkdir -p /home/direviu/app/student-submission

# Update the package list and install the 'lsof' utility
RUN apt-get update && apt-get install -y lsof

# Install ESLint
RUN npm install -g eslint@9.7.0

# Install Depedencies
RUN npm ci

# Run
ENTRYPOINT ["/bin/bash", "entrypoint.sh"]
