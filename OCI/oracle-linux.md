# Oracle Linux

If your image is running on Oracle Linux, you are running on a customized RHEL 
operating system. The default package manager for RHEL is `yum`. Best way to get
started on the Oracle Linux Compute Instances is to first install git, nvm, and yarn.

## Installing git

Installing git is quite easy:

```sh
sudo yum install git
```

## Installling nvm

NVM is a node version manager. It will help you with versioning `npm` and `node.js`.

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash

# And make sure you add this following line to your ~/.bashrc, ~/.profile, ~/.zshrc,
# or ~/.bash_profile

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")" 
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

## Installing yarn

Installing yarn requires enabling the yarn repo and obtainng the GPG key.

```sh
curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
sudo rpm --import https://dl.yarnpkg.com/rpm/pubkey.gpg

sudo yum install yarn
```
