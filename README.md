MoodTea – Online Tea Shop
MoodTea is a learning project for an online tea shop built with React. Customers can explore drinks by mood, filter and sort the menu, customize drinks, manage a shopping cart, and place orders. An admin area provides basic management for products, categories, orders, and customers.

Project type: Academic / personal learning project
Repository: https://github.com/BAO52/moodtea-app
Features
Customer
- Browse the home page, popular drinks, and new arrivals.
- Explore the menu and search drinks by name.
- Filter drinks by category, mood, and price range; sort by price or name.
- View product details and customize size, topping, sugar level, ice level, and quantity.
- Add drinks to the cart, update quantities, and remove items.
- Place an order with delivery information and an optional note.
- View order history and request cancellation by changing an order's status.
- View and update profile information.
Admin
- View dashboard summaries for products, orders, pending orders, and revenue.
- Create, edit, search, view, and delete products.
- Create, edit, and delete categories. A category cannot be deleted while products are linked to it.
- View order details and update order status.
- Search customers and view customer information.
Tech Stack
- Frontend: React, JavaScript, HTML, CSS
- UI: Bootstrap 5
- Routing: React Router DOM
- HTTP requests: Axios
- Mock REST API: JSON Server
- Data: db.json
Getting Started
Prerequisites
Install Node.js and npm.
1. Clone the repository
git clone https://github.com/BAO52/moodtea-app.git
cd moodtea-app
2. Install frontend dependencies
npm install
3. Start the mock API
The application sends API requests to http://localhost:3001. Open a terminal in the project root and run:
npx --yes json-server@0.17.4 --watch db.json --port 3001
Keep this terminal running. JSON Server exposes data from db.json through endpoints such as /products, /categories, /users, /cart, and /orders.
4. Start the React application
Open a second terminal in the project root and run:
npm start
Open http://localhost:3000 in your browser.

Important: Start the JSON Server API before using features that load or save data. The frontend currently uses the fixed API address http://localhost:3001.
Demo Accounts
The repository includes sample accounts in db.json for local testing:
Role	Email	Password
Customer	customer@example.com	123456
Admin	admin@example.com	123456


These are demo credentials for the local mock application only. Do not use real passwords or personal information in db.json.
Project Structure
moodtea-app/
├── db.json                     # Mock API data
├── public/                     # Static public assets
├── src/
│   ├── components/             # Navbar, Footer, product card, route guards
│   ├── pages/                  # Customer-facing pages
│   │   └── admin/              # Admin dashboard and management pages
│   ├── App.js                  # Application routes
│   ├── App.css
│   └── index.css
├── package.json
└── README.md
Main Routes
Route	Purpose	Access
/	Home page	Public
/menu	Browse and filter drinks	Public
/products/:id	Product details and customization	Public page; login required to add to cart
/login	Sign in with a sample account	Public
/cart	Shopping cart	Signed-in user
/checkout	Enter delivery details and place an order	Signed-in user
/my-orders	View order history	Signed-in user
/profile	View and update profile	Signed-in user
/admin	Admin dashboard	Admin
/admin/products	Product management	Admin
/admin/categories	Category management	Admin
/admin/orders	Order management	Admin
/admin/customers	Customer management	Admin


Mock API Resources
The db.json file contains these collections:
- users – sample customer and admin accounts
- categories – drink categories
- products – drink information, prices, categories, moods, and status
- cart – cart items
- orders – order details, items, totals, and status
Notes and Limitations
- This project uses JSON Server and local sample data; it is not connected to a production backend or payment gateway.
- The current login flow is a learning/demo implementation. User data is stored in localStorage, and sample passwords in db.json are plain text. This approach is not secure for production.
- Product images are loaded from external image URLs, so an internet connection may be required to display them.
- The project is intended to demonstrate frontend development, routing, API requests, CRUD operations, and basic shopping flows.