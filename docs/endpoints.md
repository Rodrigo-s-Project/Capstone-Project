# Endpoints

|    HTTP Verb    |              Name               |                   Description                   |    User stories   |
|:---------------:|:-------------------------------:|:-----------------------------------------------:|:-----------------:|
| POST            |       admin/create-company      |                Creates a company                |        1          |
| POST            |   admin/create-code/:company    |   Creates an access code for that company Id    |       2,4         |
| POST            |   admin/create-team/:company    |         Creates a team in that company          |        3          |
| POST            |   drive/upload-file/:bucket     |            Uploads a file to a bucket           |        5          |
| POST            | calendar/create-task/:calendar  |           Creates a task in a calendar          |        6          |
| POST            |       chat/open-connection      |    Opens the connections with web sockets       |        7          |
| GET             | calendar/get-tasks/:calendar    |          Get all tasks from a calendar          |        9          |
| PATCH           |  drive/protection/:document     |       Updates the protection of a document      |        10         |