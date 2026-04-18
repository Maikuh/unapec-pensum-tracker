# UNAPEC Pensum Tracker

Web app that allows you (an UNAPEC student) to keep track of which subjects you've taken. Pensums are virtually identical to the official ones.

The project can be accessed at https://unapec-pensum-tracker.vercel.app/

## Features

-   Select the career/pensum
-   Show the date the pensum was generated; UNAPEC doesn't show the actual pensum date anymore
-   Show how many subjects the user has taken (ex: _12 out of 78_) and percentage from total
-   Show how many credits the user has taken (ex: _43 out of 268_) and percentage from total
-   Show a link to the original pensum, from which data is scraped
-   Show subjects by period, with their respective code, credits, and prerequisites
-   User cannot select a subject if the prerequisites have not been taken
-   Hover over a prerequisite to show full name
-   Deselecting a subject also deselects all the subjects which had the first one as a prerequisite. This means, subject chains (like ENG001, ENG002 and so on) will all be deselected
-   User can select/deselect a whole period (cuatrimestre). If in said period there are subjects which the user cannot select, they will be ignored, and the same rules from the previous point also apply
-   Last chosen career and selected subjects persist across refreshes and closing tabs
-   User can import and export a file with the data
-   Go to top of the page via a floating button
-   View what subjects are opened by selected subject
-   View a diagram of the whole pensum and connections, highlighting selected ones
-   View certifications and electives
-   PWA functionality (works offline, can be installed)

## Contributing
See [CONTRIBUTING](CONTRIBUTING)

## Copyright
See [LICENSE](LICENSE)