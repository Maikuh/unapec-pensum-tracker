# UNAPEC Pensum Tracker

## What is this?

Web app meant to allow the user (an UNAPEC student) to keep track of which subjects they have taken. Subjects are divided by period (12 in total), just like the official pensum provided by the university.

The project can be accessed in [https://maikuh.gitlab.io/unapec-pensum-tracker/](https://maikuh.gitlab.io/unapec-pensum-tracker/)

## Features

-   Select the carreer/pensum
-   Show how many subjects the user has taken (example: _12 out of 78_)
-   Show how many credits the user has taken (example: _43 out of 268_)
-   Show subjects by period, with their respective code, credits and prerequisites
-   User can't select a subject if the prerequisites haven't been taken
-   Hover over a prerequisite to show full name
-   Deselecting a subject also deselects all the subjects which had the first one as a prerequisite. This means, subjects chains (like ENG001, ENG002 and so on) will all be deselected
-   Last chosen carreer and selected subjects persist across refreshes and closing tabs
-   User can import and export a file with the data

## What's included?

1. A [Web Scraper](scraper) which takes all of UNAPEC's links to the official pensums, and takes all the data to generate a javascript friendly file (JSON) to use in the client
2. A [client](client) written in Javascript (React), generated with create-react-app, which uses the generated json to allow all the features listed above

## What's next?

-   Include the scraper in GitLab's CI/CD, so that it runs each time there's a push in the repo.
-   Lots of refactoring. Project is meant to understand and maybe like React more.
