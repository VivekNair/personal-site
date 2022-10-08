#!/bin/bash

echo "Deploying..."
gcloud compute ssh snatched --command "cd /home/viveknair/personal-site && bash /home/viveknair/personal-site/build.sh"