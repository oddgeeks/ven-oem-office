## REQUIREMENTS:
 - ubuntu v20

## Create the Root directory
```
sudo mkdir /app
sudo chown -R $USER:0755 /app
cd /app

sudo apt-get install unzip
```

## Install NVM

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
# source ~/.bashrc

nvm install 16
nvm alias 16 default
nvm use 16

npm i -g pm2
```

After uploading the codebase to the server, initialize the codebase via the README.
