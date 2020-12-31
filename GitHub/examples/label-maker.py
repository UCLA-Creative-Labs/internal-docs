import argparse
import os
import json
from github import Github
from dotenv import load_dotenv

load_dotenv()

class LabelMaker():
  def __init__(self):
    self.signin()
    with open('github-labels.json') as file:
      self.github_labels = json.load(file)

  def signin(self):
    access_token = os.getenv("ACCESS_TOKEN")
    self.cl = Github(access_token).get_organization('UCLA-Creative-Labs')

  def _check_repo(self, repo_name):
    try:
      self.current_repo = self.cl.get_repo(repo_name)
      return True
    except:
      print(f' !! Repo {repo_name} is not in the Creative Labs GitHub Repository')
      return False

  def _delete_labels(self):
    print(f' !! Deleting all old labels')
    for label in self.current_repo.get_labels():
      label.delete()

  def _create_labels(self):
    for label in self.github_labels:
      print(f' ** Adding github label {label["name"]} with color {label["color"]}')
      self.current_repo.create_label(label["name"], label["color"],
                                      description=label["description"])
  
  def run(self, repo_name):
    if not self._check_repo(repo_name):
      return False
    
    self._delete_labels()
    self._create_labels()

if __name__ == "__main__":
  parser = argparse.ArgumentParser(description='Automatically create GitHub Labels for a given repository')
  parser.add_argument('input', metavar='N', type=str, nargs='+',
                        help='A list of repository names to configure')
  args = parser.parse_args()
  
  label = LabelMaker()
  for name in args.input:
    print(f'Running script on repo: {name}')
    label.run(name)
    print('---')
