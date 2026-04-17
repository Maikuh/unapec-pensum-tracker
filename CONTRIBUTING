# Contributing to unapec-pensum-tracker

We would love for you to contribute to `unapec-pensum-tracker` and help make it even better than it is
today! As a contributor, here are the guidelines we would like you to follow:

- [Running Locally](#local)
- [Issues and Bugs](#issue)
- [Feature Requests](#feature)
- [Submission Guidelines](#submit)
- [Coding Rules](#rules)

## <a id="local"></a> Running Locally

To run the project locally
1. [Install Bun](https://bun.com/docs/installation)
2. `bun i` to install packages
3. `bun dev` to run local dev server
4. ... Profit?


## <a id="questions"></a> Got a Question or Problem?

You can create a new [discussion][discussions] for that.

## <a id="issue"></a> Found a Bug?

If you find a bug in the source code, you can help us by
[submitting an issue](#submit-issue) to our [GitHub Repository](https://github.com/Maikuh/unapec-pensum-tracker). Even better, you can
[submit a Pull Request](#submit-pr) with a fix.

## <a id="feature"></a> Missing a Feature?

You can _request_ a new feature by [opening a new discussion][discussions] to our GitHub
Repository. If you would like to _implement_ a new feature, please open a new discussion with
a proposal for your work first, to be sure that we can use it.

Please consider what kind of change it is:

- For a **Major Feature**, first open a discussion and outline your proposal so that it can be
  discussed. This will also allow us to better coordinate our efforts, prevent duplication of work,
  and help you to craft the change so that it is successfully accepted into the project. A GitHub Issue can then later be created from this discussion, meaning it will be in the project's Roadmap.
- **Small Features** can be crafted and directly [submitted as a Pull Request](#submit-pr).

## <a id="submit"></a> Submission Guidelines

### <a id="submit-issue"></a> Submitting an Issue or opening new Discussion

Before you submit a new issue, or open a new discussion, please search the issue/discussion tracker first; it is possible that one already exist for your inquiry and solutions already exist or were implemented

For facilitating bug reproduction for future fixes, please provide a minimal reproduction scenario using a repository or a [Gist](https://gist.github.com/). Having a live, reproducible scenario gives us wealth of important information without going back & forth to you with additional questions like:

- Version of `unapec-pensum-tracker` used
- Browser used at the time the bug occurred 
- and most importantly: a use-case that fails

[discussions]: https://github.com/Maikuh/unapec-pensum-tracker/discussions

### <a id="submit-pr"></a> Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

1. Search [GitHub](https://github.com/Maikuh/unapec-pensum-tracker/pulls) for an open or closed PR
   that relates to your submission. You don't want to duplicate effort.
1. Fork the `Maikuh/unapec-pensum-tracker` repo.
1. Make your changes in a new git branch:

   ```bash
   git checkout -b fix/my-branch main
   ```

1. Create your patch, **including appropriate test cases**.
1. Run the full `unapec-pensum-tracker` test suite and ensure that all tests pass.
1. Commit your changes using a descriptive commit message
   ```shell
   git commit -a
   ```

   Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

1. Push your branch to GitHub:

   ```shell
   git push origin fix/my-branch
   ```

1. In GitHub, send a pull request to `unapec-pensum-tracker:main`.

- If we suggest changes then:

  - Make the required updates.
  - Re-run the `unapec-pensum-tracker` test suites to ensure tests are still passing.
  - Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git rebase main -i
    git push -f
    ```
That's it! Thank you for your contribution!

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

- Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

  ```bash
  git push origin -D fix/my-branch
  ```

- Check out the main branch:

  ```bash
  git checkout main -f
  ```

- Delete the local branch:

  ```bash
  git branch -D fix/my-branch
  ```

- Update your main with the latest upstream version:

  ```bash
  git pull --ff upstream main
  ```

## <a id="rules"></a> Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

<!--
// We're working on auto-documentation.
* All public API methods **must be documented**. (Details TBC). -->

- All features or bug fixes **must be tested** by one or more suites.
- We are using [Biome](https://biomejs.dev/) for lint/format, meaning we don't exactly follow a style guide (that's how Biome is). Make sure to execute `bun lint:fix` to lint, format and organize imports. Any not auto-fixable issues will need to be fixed by hand.