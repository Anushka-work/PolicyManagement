# Policy Management System - Frontend

This is a simple Angular application for managing insurance policies and claims. It was created as a beginner-level project for learning purposes.

## Features

- User Authentication (Login/Register)
- Dashboard with statistics
- Policy Management (Create, Read, Update, Delete)
- Claim Management (Create, Read, Update, Delete)
- Simple and clean UI using Bootstrap

## Prerequisites

Before running this application, make sure you have:

- Node.js (v16 or higher)
- npm (comes with Node.js)
- Angular CLI (`npm install -g @angular/cli`)

## Installation

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Configuration

Make sure the backend API is running on `http://localhost:8080`. If your backend is running on a different port, update the API URLs in:
- `src/app/services/auth.service.ts`
- `src/app/services/policy.service.ts`
- `src/app/services/claim.service.ts`

## Running the Application

1. Start the development server:
   ```
   npm start
   ```
   or
   ```
   ng serve
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:4200
   ```

3. You will be redirected to the login page. If you don't have an account, register first.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/           # Login component
│   │   ├── register/        # Registration component
│   │   ├── dashboard/       # Dashboard component
│   │   ├── navbar/          # Navigation bar component
│   │   ├── policy-list/     # Policy list component
│   │   ├── policy-form/     # Policy create/edit form
│   │   ├── claim-list/      # Claim list component
│   │   └── claim-form/      # Claim create/edit form
│   ├── models/
│   │   ├── user.model.ts    # User model
│   │   ├── policy.model.ts  # Policy model
│   │   └── claim.model.ts   # Claim model
│   ├── services/
│   │   ├── auth.service.ts  # Authentication service
│   │   ├── policy.service.ts # Policy service
│   │   └── claim.service.ts # Claim service
│   ├── guards/
│   │   └── auth.guard.ts    # Route guard for authentication
│   ├── app-routing.module.ts
│   ├── app.module.ts
│   └── app.component.ts
├── index.html
├── main.ts
└── styles.css
```

## Default Credentials

The application expects you to register a new account or use credentials from your backend database.

## Technologies Used

- Angular 17
- TypeScript
- Bootstrap 5
- RxJS
- HttpClient for API calls

## API Endpoints Expected

The application expects the following backend endpoints:

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration

### Policies
- GET `/api/policies` - Get all policies
- GET `/api/policies/{id}` - Get policy by ID
- POST `/api/policies` - Create new policy
- PUT `/api/policies/{id}` - Update policy
- DELETE `/api/policies/{id}` - Delete policy

### Claims
- GET `/api/claims` - Get all claims
- GET `/api/claims/{id}` - Get claim by ID
- POST `/api/claims` - Create new claim
- PUT `/api/claims/{id}` - Update claim
- DELETE `/api/claims/{id}` - Delete claim

## Build for Production

To build the project for production:

```
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Notes

- This is a beginner-level project with simple UI and functionality
- The application uses localStorage for storing authentication tokens
- All routes except login and register are protected with AuthGuard
- The UI is kept simple and clean using Bootstrap for styling

## Troubleshooting

1. **CORS Issues**: Make sure your backend allows CORS from `http://localhost:4200`
2. **API Connection**: Verify that your backend is running on `http://localhost:8080`
3. **Module Errors**: Run `npm install` to ensure all dependencies are installed
4. **Port Already in Use**: Change the port using `ng serve --port 4300`

## Support

This is a learning project. Feel free to modify and extend it according to your needs.
