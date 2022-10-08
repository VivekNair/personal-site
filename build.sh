#!/bin/bash

PATH=/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games:/home/viveknair/n/bin

echo $PATH

cd /home/viveknair/personal-site

echo "Getting latest assets..."
GIT_SSH_COMMAND='ssh -i /home/viveknair/.ssh/id_personal_site' git pull --rebase origin main

echo "Generating SSG..."
yarn install
yarn build

echo "Restarting Caddy..."
sudo systemctl restart caddy