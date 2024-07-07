MERN Stack Coding Challenge
This project is part of a coding challenge where the task is to build a MERN (MongoDB, Express.js, React.js, Node.js) stack application. The challenge involves both backend and frontend development tasks.

Backend Task
Data Source
THIRD PARTY API URL: https://s3.amazonaws.com/roxiler.com/product_transaction.json
REQUEST METHOD: GET
RESPONSE FORMAT: JSON
APIs Implemented
Initialize Database API

Endpoint: /api/init-database
Function: Fetches JSON from the third-party API and initializes the MongoDB database with seed data.
List Transactions API

Endpoint: /api/transactions
Parameters: month, search_q, page
Functionality: Supports search and pagination on product transactions based on title/description/price.
Statistics API

Endpoint: /api/statistics
Parameters: month
Functionality:
Total sale amount of selected month.
Total number of sold items of selected month.
Total number of not sold items of selected month.
Bar Chart API

Endpoint: /api/bar-chart
Parameters: month
Functionality: Returns price range and number of items in each range for the selected month.
Pie Chart API

Endpoint: /api/pie-chart
Parameters: month
Functionality: Finds unique categories and number of items in each category for the selected month.
Combined Data API

Endpoint: /api/combined-data
Functionality: Fetches data from all above APIs, combines the responses, and sends a final JSON response.
Frontend Task
The frontend consumes the APIs created on the backend to display the following components on a single page:

Transactions Table

Displays transactions based on selected month and search criteria.
Pagination functionality (Next/Previous).
Transactions Statistics

Displays total amount of sale, total sold items, and total not sold items for the selected month.
Transactions Bar Chart

Displays price range and number of items in each range for the selected month.
Screenshots
Include screenshots or mockups of your frontend components here:

Transactions Table

Transactions Statistics

Transactions Bar Chart

Getting Started
Prerequisites
Node.js
MongoDB Atlas account (or local MongoDB installation)
Git
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/your_username/your_repository.git
cd your_repository
Install dependencies:

bash
Copy code
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
Set up environment variables:

Create a .env file in the backend directory and add the following:

plaintext
Copy code
MONGODB_URI=your_mongodb_uri
Start the application:

bash
Copy code
# Start the backend server (from the backend directory)
npm start

# Start the frontend development server (from the frontend directory)
npm start
Open your browser and visit http://localhost:3000 to view the application.

Technologies Used
MongoDB
Express.js
React.js
Node.js
JavaScript (ES6+)
HTML/CSS
License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
Include any acknowledgments or credits here.
