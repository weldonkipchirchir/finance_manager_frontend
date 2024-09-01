# Finance Manager

Finance Manager is a web application that helps users manage their personal finances. Users can track their income, expenses, set financial goals, and monitor their progress over time. This application is built using React, Next.js, and TypeScript, and connects to a backend API for data storage and retrieval.

## Features

- **User Authentication**: Register and log in securely.
- **Income Tracking**: Add and update income sources.
- **Expense Tracking**: Add and categorize expenses.
- **Goal Setting**: Set financial goals and monitor your progress.
- **Dashboard**: View a summary of your financial status.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed
- Backend API set up and running (e.g., using a Go server)
    use ```https://github.com/weldonkipchirchir/finance_manager``` for backend api (rust)
- Environment variables configured (details below)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/weldonkipchirchir/finance_manager_frontend
cd finance_manager_frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

```plaintext
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_TOKEN_NAME=finance_manager_token
NEXT_SECRET_KEY=your_secret_key
```

- **NEXT_PUBLIC_API_URL**: The URL of the backend API server.
- **NEXT_TOKEN_NAME**: The name used to store the authentication token in local storage.
- **NEXT_SECRET_KEY**: A secret key used for encrypting sensitive data.

### 4. Start the Development Server

```bash
npm run dev
```

The application should now be running at `http://localhost:3000`.

### 5. Building for Production

To create a production build, run:

```bash
npm run build
```

### 6. Running the Production Build

After building the application, you can start it in production mode with:

```bash
npm start
```

## Usage

1. **Register/Login**: Create a new account or log in with your existing credentials.
2. **Manage Income/Expenses**: Add, edit, or delete your income and expenses.
3. **Set Financial Goals**: Define your financial goals and track your savings towards them.
4. **View Dashboard**: Access the dashboard to see a summary of your financial activities.

## Contributing

If you would like to contribute to this project, please fork the repository and create a pull request with your changes.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Contact

If you have any questions or feedback, feel free to reach out to the project maintainer at [weldonkipchirchir23@gmail.com].
