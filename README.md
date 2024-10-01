# Setting up the project locally

The projects consists of two directories
**Client and Server**. <br/>

## Prerequisites <br/>

Make sure the following are installed in the local system

- Node.js
- npm

## Running the project locally

Before running the backend and frontend make sure to add the .env files variables in both the projects. <br/>
For the frontend define:

```
VITE_REACT_APP_API_URL=<<BACKEND URL>>
```

For the backend define:

```
# this is only for local, replace with your actual mongoDB url once created
MONGO_URI=mongodb://127.0.0.1:27017/rosterize
PORT=5000

# example, create a secure token once deploying to production
TOKEN_SECRET=secret

# provide your own email that you want to use for the admin
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin

# the below two have been discussed later in a seperate section
PASSWORD_RESET_SENDER_EMAIL = < sender mail address >
PASSWORD_RESET_SENDER_PASSWORD = < password for the mail address >
```

### Starting the Frontend

```
cd client
npm i
npm run dev
```

### Starting the Backend

```
cd server
npm i
node seed.js
node index.js
```

## Creating a GitHub Account and Pushing the Project to GitHub

### Step 1: Create a GitHub Account

1. Go to [GitHub's sign-up page](https://github.com/join).
2. Fill in the required information like username, email, and password.
3. Follow the instructions to verify your account.

Once your account is created, you're ready to push your project to GitHub.

### Step 2: Install Git

If you haven't installed Git on your system yet, follow the instructions below:

- [Download and install Git](https://git-scm.com/downloads) according to your operating system.
- After installation, open a terminal and configure Git with your name and email:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### Step 3:

1. Open the terminal in the root directory of your project.
2. Initialize the Git repository:

```
git init
```

3. Add all files to the repository:

```
git add .
```

4. Commit the changes:

```
git commit -m "Initial commit"
```

5. Go to GitHub, click on the + icon in the top-right corner, and select New Repository.
6. Name your repository and click Create Repository.
7. After creating the repository, GitHub will give you a URL for your repo. Add this URL to your local repository as the remote origin:

```
git remote add origin https://github.com/your-username/your-repo-name.git
```

8. Push the code to GitHub:

```
git push -u origin master
```

# Setup for GMail account to send mails for the forgot-password functionality

1. Please refer to this video to setup the forgot-password functionality -[Setup Sending Mails](https://youtu.be/klDTBiW6iiM?si=7t4HCOxwdLwb0vd9&t=22)
2. Once the password has been created using the above method, replace the ENV variables PASSWORD_RESET_SENDER_EMAIL and PASSWORD_RESET_SENDER_PASSWORD with your email and the password created in step 1.

## Creating a MongoDB Collection

### Step 1: Create a MongoDB Account

1. Go to [MongoDB's website](https://www.mongodb.com/) and sign up for an account.
2. After signing in, go to your **MongoDB Atlas** dashboard.
3. Click **Create a Cluster** and follow the instructions to set up a free-tier cluster.

### Step 2: Create a Database and Collection

1. Once your cluster is ready, click on **Browse Collections**.
2. Click **Add My Own Data** to create a new database.
3. Enter a database name and collection name, then click **Create**.

### Step 3: Connecting MongoDB to Your Project

1. In your MongoDB Atlas dashboard, go to **Database Access** and create a new database user with a username and password.
2. Go to **Network Access** and allow access from your IP address or select **Allow Access from Anywhere**.
3. In the **Clusters** tab, click **Connect** and choose **Connect your application**.
4. Copy the connection string, replace `<password>` with your MongoDB user password, and paste it into your `.env` file under `MONGO_URI`.

Example `.env`:
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority
The above is only an example string, the actual string will be provided on the mongo DB website.

### Step 4. Add the MONGO_URI in the environment variables.

# Deploying the project to vercel

The project has already been included with the required vercel.json files. <br/>
The user is required to:

1. push the code to their github/gitlab account.
2. Create a vercel account and connect the github/gitlab account with it.
3. Go the Add new button on the dashboard and select project.![image](https://github.com/user-attachments/assets/1d4d2126-bdea-45a7-a1ff-ea6e626e45cf)
4. Select the repository, in which they have uploaded the code, and click on import.![image](https://github.com/user-attachments/assets/062640d5-9844-440c-9fdb-372105c61dbe)
5. Configure the project, click on edit and change the root directory from ./ to server folder. And also add your environment variables including the MONGO_URI, PORT, TOKEN_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, PASSWORD_RESET_SENDER_EMAIL, PASSWORD_RESET_SENDER_PASSWORD <br/>![image](https://github.com/user-attachments/assets/5788760d-472c-4a69-b16e-bcc7877fb290)
6. Click on deploy and the backend should be deployed.
7. Once the deployment is complete, you will receive a URL for the backend. For example: ![image](https://github.com/user-attachments/assets/ec79ab9a-3867-4b09-85d7-48797117d61d)
8. Copy the URL and keep it with you for further steps.
9. Repeat the same process again, but this time for the frontend and in the folder selection instead of selecting server, select client. Add the env variables and in your **VITE_REACT_APP_API_URL** paste the backend url that you received after deploying the backend to vercel.
10. Click on deploy.
11. After deployment is done you'll receive a URL, this will be your frontend URL from where you can access the web application.
12. Once you receive the frontend URL, go the previous deployement of the backend server. Select Settings: ![image](https://github.com/user-attachments/assets/7b197313-c081-4450-b1c6-becd0b659c0b)
13. Goto environment variables and click on add another.![image](https://github.com/user-attachments/assets/6cb6e3bd-c157-44f9-bf25-c31da27bb6ab)
14. Add this new Key as FRONTEND_URL and paste the URL received after the frontend deployement.
15. Go to the deployments section, select the latest deployment options and click on the redeploy option. <br/> ![image](https://github.com/user-attachments/assets/38fc1395-796e-450f-b3cf-4f054e490ec8)
16. Finally click on redeploy.<br/> ![image](https://github.com/user-attachments/assets/60bc898b-f13e-4f41-b0db-47c2f5572759)
17. After all the process are done, goto to the local setup of the project and replace your MONGO_URI, ADMIN_EMAIL and ADMIN_PASSWORD with your with the newly created Mongo DB url and actual email and password for the admin user. Once done, in the terminal, go the working directory of the project and run ` node seed.js`. This will create the admin user in the production
