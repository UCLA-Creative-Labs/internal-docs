# Labels

GitHub labels are important for organization. In some cases the labels are used to
prevent `mergify` from merging a file in a specific way. Other cases, we use labels
to prioritize issues and let other team members know which ones are `in progress`.

When triaging an issue, make sure to go top-down:
- [Categorical](#Categorical-Labels): what category does this issue fall under?
- [Context](#Context-Labels): what stage of development is this issue?
- [Priority](#Priority-Labels): how important is this issue?
- [Effort](#Effort-Labels): how much work will this issue take to resolve?

To download or programmatically update a repository's labels check out the 
following sections:
- [Getting Started](#Getting-Started)
- [Download Labels](#Download-Labels)
- [Add Labels](#Add-Labels)

## Categorical Labels

- **`bug`**: bugs are unexpected behaviors within the code-base: anything from incorrect styling, functionality, or hosting.
- **`feature`**: features are enhancements to the existing implementation; these require a use case and a design.
- **`chore`**: chores are the boring stuff like docs, refactoring, and everything else.
- **`tracking`**: tracking issues are ones that follow a subject or multiple issues and act like a centralized place for discussion.

## Context Labels

- **`in-progress`**: tag issues with `in-progress` and assign to yourself when you begin beep booping.
- **`needs-design`**: tag issues with `needs-design` when a feature/bug needs a visual reference in order to proceed.
- **`guidance`**: tag issues with `guidance` and `@ucla-creative-labs/tech` to get support from our tech team.

## Priority Labels

- **`needs-triage`**: indicates a need to determine the priority/effort of an issue
- **`p0`**: these issues need to be handled immediately; drop everything to fix this bug
- **`p1`**: these issues need to be done relatively soon; within the next week
- **`p2`**: these issues could be put on the back burner but should be done within a month
- **`p3`**: not necessary for GA but something to consider in the backlog.

## Effort Labels

- **`good first issue`**: work items are good for `first time contributors` to tackle; add a description of what the change might look like to help new contributors
- **`effort/small`**: work items that require around one to two nights of work; ~2-4 hours
- **`effort/medium`**: work items that require around a week's worth of work; ~14 hours
- **`effort/large`**: work items that require over a week's worth of work; > 14 hours

## Mergify/PR Labels

- **`pr/do-not-merge`**: signals Mergify not to merge a PR despite approval; use it when you need another set of eyes to approve a change
- **`pr/work-in-progress`**: signals Mergify not to merge a PR despite approval; use it when you want to publish code for feedback and want to prevent accidentally approval leading to automatic merge 
- **`pr/no-squash`**: signals Mergify, not to squash the commits of this pull request

## Getting Started

We use [`PyGithub`](https://pygithub.readthedocs.io/en/latest/github.html) to handle
downloading and setting repository labels.

```sh
pip3 install pygithub
pip3 install dotenv
```

Create a `.env` file with your GitHub access token.

```sh
#.env
ACCESS_TOKEN=<...>
```

Now you can run the following scripts to automatically download and update labels.

## Download Labels

Use `examples/download-labels.py` to download the labels in a json format.

```sh
cd examples

# the output file here is automatically set to `github-labels.json`
python3 download-labels.py <repository_name>

# customize your output file
python3 download-labels.py <repository_name> -o <output_file>
```

## Add Labels

Use `examples/label-maker.py` to set a repository's labels to be equal to the labels
in `github-labels.json`.

```sh
cd examples
python3 label-maker.py <repository_name> <repository_name> ...
```

**Note: THIS WILL DELETE ALL LABELS IN THE REPOSITORY**

**Note: You can set the labels to more than one repository in one call**
