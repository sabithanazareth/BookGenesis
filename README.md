BookGenesis: A web application for book management with search functionality and author profiles, utilizing React with Vite and Apollo Client for efficient data management

Collections and Relationships
Two main collections: Books and Authors. 
An Author can have a list of Books they've penned, while each Book maintains a reference to its creator. This relational aspect facilitates operations like adding, updating, or deleting records for books or authors, providing a dynamic and interactive experience.

Technology Stack
Backend
Express.js: Offers a robust framework for our server, simplifying the setup of routes and middleware.
GraphQL: Serves as the backbone for our API, enabling complex CRUD operations with simplified queries and mutations compared to traditional REST APIs. 
Redis: Empowers the application with caching mechanisms, significantly improving data retrieval times and reducing server load.

Frontend
React: The choice of React has allowed me to build a dynamic and responsive user interface, honing my skills in component-based architecture and state management.
Vite: This modern build tool enabled me to set up a lightweight and fast-reacting front-end environment, enhancing my development workflow.

Features:
Dynamic search functionality for books and authors.
Real-time addition and deletion of books and authors.
Editing capabilities for existing records, ensuring data is current and accurate.
Caching with Redis for efficient data fetching.
Responsive design that caters to various devices and screen sizes.
