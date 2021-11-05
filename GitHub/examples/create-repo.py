import sys
import os
from github import Github
from dotenv import load_dotenv

load_dotenv()

def create():
    project = str(sys.argv[1])
    isCL = 1 == int(sys.argv[2])
    isPrivate = 1 == int(sys.argv[3])
    isInternal = 1 == int(sys.argv[4])
    access_token = os.getenv("ACCESS_TOKEN")
    user = Github(access_token).get_user()
    tech = -1
    if isCL:
        cl = Github(access_token).get_organization('UCLA-Creative-Labs')
        if isInternal:
            tech = list(filter(lambda t: t.name == 'tech', cl.get_teams()))[0].id
        user = cl
    if tech > 0:
        repo = user.create_repo(project, private=isPrivate, team_id=tech)
    else:
        repo = user.create_repo(project, private=isPrivate)
    print("Succesfully created repository {}".format(project))

if __name__ == "__main__":
    create()
