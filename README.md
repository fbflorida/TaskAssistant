# TaskAssistant
A Task Management system built using Angular and C#.Net Core

## TaskAssistantWeb 
A web application built using Angular v20.3.0
### Functionalities:
Authentication - authentication is handled via a backend REST API.<br>
HttpInterceptor - a feature that handles all outgoing HttpRequest to make sure it always send Bearer Token header <br>
AuthGuard - prevents other parts of the application to be accessed if not Authenticated

## TaskAssistantAPI
A C# .Net Core WebApi project that exposes API for the User Management and Task management (CRUD Operations)

### Functionalities:
Authentication Service - using .Net Identity, user can register and login with the minimal information required <br>
Task Management Service - exposes endpoint for GET, POST, PUT, PATCH, DELETE operations <br>
Database Integration - For the EntityFramework DbContext, PostgreSQL is used

## Running the code Locally
For the Web Application, make sure to install Angular on your local machine <br>
After downloading, open command prompt to the source folder and run `npx ng serve`.<br>
Navigate to `http://localhost:4200` and the web application should be loaded.<br>
For the Web API project, open the command prompt and navigate to the source code folder<br> 
**DB Install**: Open the appsettings.json file and modify the TaskAssistantDbContext connectionstring. Then run `dotnet ef database update` <br>
**Run the API Service**: run the command line `dotnet run -lp https` for the secure endpoint

## Database Tables
After running the `ef migrations`, your database should have tables for user with `Aspnet_` prefixes and 1 Table for task. The Aspnet_User table is linked to the Task table via a ForeignKey `ApplicationUserId`<br>
The Task Table has the following fields:
* Id
* Title
* Description
* Priority
* Status
* Category
* ApplicationUserId (FK)

## Limitations/Further Enhancements
* AI Feature for summarizing tasks is not implemented
* Error Messages Handling - for the API integrations, in case of errors, there is no ui display to user and also logging
* Admin page for managing users
* Additional login/registration options using OAuth/SSO


