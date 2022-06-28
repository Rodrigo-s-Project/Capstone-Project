# Data Models

## User
|      Column name      |    Type    |                          Description                             |
|:---------------------:|:----------:|:----------------------------------------------------------------:|
| email                 |  string    |                     Email of the user                            |
| password              |  string    |                    Password of the user                          |
| globalUsername        |  string    |               Permanent Username of the user                     |
| typeAccount           |  string    |        Type of account "free" || "basic" || "enterprise"         |
| status                |  string    |                  "available" || "unavailable"                    |
| companies             |  string[]  |              Array of id's of joined companies                   |
| profilePictureURL     |  string    |                    URL of the profile picture                    |
| isDarkModeOn          |  boolean   |                       Is dark mode on                            |
| notifications         |  string[]  |              Array of id's of user notifications                 |
| payment               |  string    |                     Id of related payment                        |
| typesOfUserInCompany  |  Object[]  |             A descriptor of the user role in each company        |
| typesOfUserInTeam     |  Object[]  |              A descriptor of the user role in each team          |

typesOfUserInCompany:
* type: "Employee" || "Admin" || "Client"
* company: company id
* username: string

typesOfUserInTeam:
* type: "Employee" || "Admin" || "Client"
* team: team id
* username: string

## Company
|      Column name      |    Type    |               Description                  |
|:---------------------:|:----------:|:------------------------------------------:|
| name                  |  string    |          Name of the company               |
| companyPictureURL     |  string    |        URL of the company's picture        |
| numberUsers           |  int       |        Number of users in company          |
| numberTeams           |  int       |        Number of teams in company          |
| teams                 |  string[]  |     Array of id's of the joined teams      |
| users                 |  string[]  |     Array of id's of the joined users      |
| admin                 |  string    |            Id of the admin user            |
| accessCode            |  string    |         Access code to join company        |

## Payment
|      Column name      |    Type    |               Description                  |
|:---------------------:|:----------:|:------------------------------------------:|
| user                  |   string   |             Id of the user                 |
| type                  |   string   |          "basic" || "enterprise"           |
| name                  |   string   |         Name of the user that paid         |
| email                 |   string   |        Email of the user that paid         |
| phoneNumber           |   string   |    Phone Number of the user that paid      |

## Team
|      Column name      |    Type    |               Description                  |
|:---------------------:|:----------:|:------------------------------------------:|
| name                  |  string    |           Name of the team                 |
| teamPictureURL        |  string    |         URL of the team's picture          |
| numberUsers           |    int     |        Number of users in team             |
| users                 |  string[]  |    Array of id's of the joined users       |
| buckets               |  string[]  |     Array of id's of the team's bucket     |
| messages              |  string[]  |    Array of id's of the team's messages    |
| connections           |  string[]  |  Array of id's of the team's connections   |
| calendar              |   string   |          Id of the team's calendar         |
| accessCode            |   string   |          Access code to join team          |

## Notification
|      Column name      |    Type    |               Description                  |
|:---------------------:|:----------:|:------------------------------------------:|
| user                  |   string   |            Id of the user                  |
| unreadMessages        |  string[]  |          Array of id's of messages         |
| unreadFiles           |  string[]  |           Array of id's of files           |
| toDos                 |  string[]  |           Array of id's of tasks           |

## File
|      Column name      |    Type    |                                     Description                                        |
|:---------------------:|:----------:|:--------------------------------------------------------------------------------------:|
| name                  |   string   |                                     Name of the file                                   |
| isProtected           |   boolean  |                                   Is the file protected                                |
| parentDocument        |   string   |    String to identify parent document "f:idFile" (folder) || "b:idFile" (bucket)       |
| type                  |   string   |                               Document type (.pdf, .doc, .etc)                         |
| bucket                |   string   |                                Id of the related bucket                                |
| usersRead             |  string[]  |                       Array of id's of users that have read the  file                  |

## Bucket
|      Column name      |    Type    |                                       Description                                           |
|:---------------------:|:----------:|:-------------------------------------------------------------------------------------------:|
| name                  |   string   |                                  Name of the bucket                                         |
| team                  |   string   |                            Id of the owner team of this bucket                              |
| documents             |  string[]  |   Array of id's of the files or folders "d:ObjectID" (document) || "f:ObjectID" (folder)    |
| users                 |  string[]  |               Array of id's of the users that have access to this bucket                    |

## Message
|      Column name      |    Type    |                                 Description                                   |
|:---------------------:|:----------:|:-----------------------------------------------------------------------------:|
| text                  |   string   |                                 Text of the message                           |
| time                  |     int    |   The number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.      |
| connection            |   string   |                    Id of the related connection between users                 |
| mediaURL              |   string   |                      If any media provided, URL for that                      |
| usersRead             |  string[]  |             Array of id's of users that vhave read the message                |
| team                  |   string   |                    Id of the team that owns this message                      |

## Folder
|      Column name      |    Type    |                                     Description                                        |
|:---------------------:|:----------:|:--------------------------------------------------------------------------------------:|
| name                  |   string   |                                Name of the folder                                      |
| isProtected           |   boolean  |                                Is the folder protected                                 |
| parentDocument        |   string   |    String to identify parent document "f:idFile" (folder) || "b:idFile" (bucket)       |
| documents             |  string[]  | Array of id's of the files or folders "d:ObjectID" (document) || "f:ObjectID" (folder) |
| bucket                |   string   |                        Id of the bucket that has this folder                           |

## Connection
|      Column name      |    Type    |                        Description                           |
|:---------------------:|:----------:|:------------------------------------------------------------:|
| users                 |  string[]  |     Array of id's of the users in this connection (chat)     |
| messages              |  string[]  | Array of id's of the messages sent in this connection (chat) |
| team                  |   string   |             Id of the team that owns this chat               |

## Calendar
|      Column name      |    Type    |                  Description                     |
|:---------------------:|:----------:|:------------------------------------------------:|
| team                  |   string   |     Id of the team that owns this calendar       |
| tasks                 |  string[]  |      Array of id's of the related tasks          |
| tags                  |  string[]  |      Array of id's of the related tags           |

## Tag
|      Column name      |    Type    |               Description                  |
|:---------------------:|:----------:|:------------------------------------------:|
| calendar              |   string   |        Id of the related calendar          |
| color                 |   string   |              Color of the tag              |
| text                  |   string   |              Text of the tag               |


## Task
|      Column name      |    Type    |                        Description                           |
|:---------------------:|:----------:|:------------------------------------------------------------:|
| calendar              |   string   |                  Id of the related calendar                  |
| name                  |   string   |                    Name of the task                          |
| singleDate            |   boolean  |              Is it programmed for a single date              |
| fromDate              |    int     |                   From date (date in int)                    |
| toDate                |    int     |     To date (date in int), only if singleDate is false       |
| description           |   string   |                   Description of the task                    |
| users                 |  string[]  |     Array of id's of the users involved in this task         |
| tags                  |  string[]  |            Array of id's of the tags in this task            |
