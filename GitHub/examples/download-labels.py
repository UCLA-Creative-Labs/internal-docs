import argparse
import os
import json
from github import Github
from dotenv import load_dotenv

load_dotenv()

def download_labels(repo, output_file='github-labels.json'):
  access_token = os.getenv("ACCESS_TOKEN")
  cl = Github(access_token).get_organization('UCLA-Creative-Labs')
  try:
    print(f'Getting labels...')
    labels = cl.get_repo(repo).get_labels()
    github_labels = []
    for label in labels:
      github_labels.append({
        'name': label.name,
        'color': label.color,
        'description': label.description,
      })
    print(f'Saving labels to {output_file}...')
    with open(output_file, 'w') as file:
      json.dump(github_labels, file, indent=2)
  except:
    print(f'Failed to get the labels from {repo}')

if __name__ == "__main__":
  parser = argparse.ArgumentParser(description='Automatically create GitHub Labels for a given repository')
  parser.add_argument('--output', '-o', type=str, default='github-labels.json',
                        help='The output file')
  parser.add_argument('input', metavar='N', type=str, nargs=1,
                        help='A repository to save')
  args = parser.parse_args()

  download_labels(args.input[0], args.output)