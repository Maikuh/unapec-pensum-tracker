# UNAPEC Pensum Tracker

**Language:** _English_ / [Español](docs/README.es.md)

## What is this?

Web app meant to allow the user (an UNAPEC student) to keep track of which subjects they have taken. Pensums are taken from the provided ones in the official UNAPEC website (via scraping) and then used in the client (React.js).

The project can be accessed in [https://maikuh.gitlab.io/unapec-pensum-tracker/](https://maikuh.gitlab.io/unapec-pensum-tracker/)

## Features

-   Select the career/pensum
-   Show the pensum date, taken from the official page
-   Show how many subjects the user has taken (example: _12 out of 78_) and percentage from total
-   Show how many credits the user has taken (example: _43 out of 268_) and percentage from total
-   Show a link to the original pensum, from which data is scraped
-   Show subjects by period, with their respective code, credits, and prerequisites
-   User cannot select a subject if the prerequisites have not been taken
-   Hover over a prerequisite to show full name
-   Deselecting a subject also deselects all the subjects which had the first one as a prerequisite. This means, subject chains (like ENG001, ENG002 and so on) will all be deselected
-   User can select/deselect a whole period (cuatrimestre). If in said period there are subjects which the user cannot select, they will be ignored, and the same rules from the previous point also apply
-   Last chosen career and selected subjects persist across refreshes and closing tabs
-   User can import and export a file with the data
-   Go to top of the page via a floating button

## What's included?

1. A [Web Scraper](scraper) which takes all of UNAPEC's links to the official pensums, and takes all the data to generate a Javascript friendly file (JSON) to use in the client
2. A [client](client) written in Typescript (React), generated with create-react-app, which uses the generated json to allow all the features listed above

## What's next?

-   Include the scraper in GitLab's CI/CD, so that it runs each time there is a push in the repo.
-   Refactoring (WIP)
-   A Summary of subjects taken
-   Add Testing
