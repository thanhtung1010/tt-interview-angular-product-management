# Products Management

## Project Setup

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) (version 18.2.1) and requires [NodeJS](https://nodejs.org/en) (version 20.15.1 or later).

## Backend as a Service (BaaS)

This project leverages Firebase for its backend functionality. Your Firebase configuration is stored in the `environment.ts` file. Feel free to replace it with your own configuration.

## Sorting Tables

Server-side sorting is implemented using Firebase. To enable sorting by a specific column, you'll need to create an index in your Firebase project for the corresponding field used in the `orderBy` function.

## Development server

Run `npm i` before run start command.
Run `ng serve` or `npm start` for a dev server. Navigate to `http://localhost:8080/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
