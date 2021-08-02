import argparse
from enum import Enum
import os
from github import Github
from dotenv import load_dotenv
from github.Organization import Organization
from github.Repository import Repository
from github.Team import Team

class PERMISSION(Enum):
  READ='pull'
  TRIAGE='triage'
  WRITE='push'
  MAINTAIN='maintain'

class AccessGranter():
  '''
  An class to give 
  '''
  def __init__(self, organization, team_name, permissions: PERMISSION):
    self.organization: Organization = organization
    self.permissions = permissions
    self.signin(organization)
    self._check_team(team_name)

  def signin(self, organization):
    access_token = os.getenv("ACCESS_TOKEN")
    if organization: 
      self.git = Github(access_token).get_organization(organization)
    else:
      self.git = Github(access_token).get_user()

  def _check_repo(self, repo_name):
    try:
      self.current_repo: Repository = self.git.get_repo(repo_name)
      return self.current_repo
    except:
      print(f' !! Repo {repo_name} is not a valid GitHub Repository')
      return False

  def _check_team(self, team_name):
    try:
      self.team: Team = self.git.get_team_by_slug(team_name)
      return True
    except:
      raise ValueError(f' !! Team {team_name} does not exist in {self.organization}')
  
  def run(self, allFlag, repositories):
    if allFlag:
      repositories = self.git.get_repos(type='public')

    for repo in repositories:
      print(f'Granting {self.team.name} {self.permissions.value} permissions to {repo.name}')
      self.run_on_repo(repo.name)
      print('---')

  def run_on_repo(self, repo_name):
    if not self._check_repo(repo_name):
      return False
    self.team.set_repo_permission(self.current_repo, self.permissions.value)
    

if __name__ == "__main__":
  load_dotenv()

  parser = argparse.ArgumentParser(description='Grant permissions')
  parser.add_argument('input', metavar='N', type=str, nargs='?',
                        help='A list of repository names to configure')
  parser.add_argument('--organization', '-o', type=str, required=True,
                        help='The organization to signin to')
  parser.add_argument('--team', type=str, required=True,
                        help='The team to grant access to')
  parser.add_argument('--all', '-a', action='store_true',
                        help='Grant the team access to all public repositories')

  parser.add_argument('--read', '-r', action='store_true', help='Grant read (pull) permission')
  parser.add_argument('--triage', '-t', action='store_true', help='Grant triage permissions')
  parser.add_argument('--write', '-w', action='store_true', help='Grant write (push) permissions')
  parser.add_argument('--maintain', '-m', action='store_true', help='Grant maintainer permssions')
  
  args = parser.parse_args()

  permissions=None
  if args.maintain:
    permissions = PERMISSION.MAINTAIN
  if args.write:
    permissions = PERMISSION.WRITE
  if args.triage:
    permissions = PERMISSION.TRIAGE
  if args.read:
    permissions = PERMISSION.READ
  
  if not permissions:
    raise argparse.ArgumentError('No permissions argument. Please run with --read, --triage, --write, or --maintain.')

  granter = AccessGranter(args.organization, args.team, permissions)
  granter.run(args.all, args.input)