# **Image Search with Authentication**

This is a Node.js-based GraphQL API that provides a secure image search service. Users must register and log in to access the image search feature. The API fetches images from Unsplash, Pixabay, and Storyblocks.

---

## **Features**

- **User Registration**: Allows new users to register.
- **User Login**: Allows registered users to log in and receive a JWT token.
- **JWT Authentication**: Secures the API and ensures only authenticated users can access the image search feature.
- **Image Search**: Fetches images from Unsplash, Pixabay, and Storyblocks based on search queries.

---

## **Prerequisites**

Ensure that you have the following installed:

- **Node.js** (v14 or later)
- **npm** (Node Package Manager)

---

## **Setup**

1. **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd project
    ```
2. **Install Dependencies:**
    ```bash
    npm install
    ```
3. **Set Up Environment Variables:**
Create a .env file in the root directory and add the following environment variables:
    ```bash
    UNSPLASH_API_KEY=your_unsplash_api_key
    PIXABAY_API_KEY=your_pixabay_api_key
    STORYBLOCKS_API_KEY=your_storyblocks_api_key
    ```
Replace `your_unsplash_api_key`, `your_pixabay_api_key`, `your_storyblocks_api_key`, and `your_jwt_secret` with your actual API keys and a secure secret for JWT.
4. **Run the Server:**
    ```bash
    node server/app.js
    ```
The server will start at `http://localhost:3000`.

---

## **API Endpoints**

### **1. User Registration**
- **Route**: `POST /api/auth/register`
- **Purpose**: Registers a new user by saving their email and password.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully."
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Missing or invalid email/password.
  - `400 Bad Request`: User already exists.

---

### **2. User Login**
- **Route**: `POST /api/auth/login`
- **Purpose**: Logs in a registered user and returns a JWT token.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX..."
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Missing or invalid email/password.
  - `400 Bad Request`: Invalid credentials (email or password incorrect).

---

### **3. Image Search (Protected)**
- **Route**: `GET /api/images/search`
- **Purpose**: Allows an authenticated user to search for images from multiple sources (e.g., Unsplash, Pixabay, Storyblocks).
- **Headers**:
  - `Authorization: Bearer <your_jwt_token_here>`
- **Query Parameters**:
  - `q` (required): The search query (e.g., "nature", "animals").
- **Example**:
  ```
  GET /api/images/search?q=nature
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...
  ```
- **Response**:
  ```json
  {
    "query": "nature",
    "results": [
      {
        "image_ID": "abc123",
        "thumbnails": "https://example.com/thumbnail.jpg",
        "preview": "https://example.com/preview.jpg",
        "title": "Beautiful Nature",
        "source": "Unsplash",
        "tags": ["nature", "forest", "trees"]
      },
      {
        "image_ID": "xyz456",
        "thumbnails": "https://example.com/thumbnail2.jpg",
        "preview": "https://example.com/preview2.jpg",
        "title": "Ocean View",
        "source": "Pixabay",
        "tags": ["ocean", "sea", "waves"]
      }
    ],
    "total_results": 2
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Missing or invalid JWT token.
  - `400 Bad Request`: Missing or invalid query parameter `q`.

---

## **Error Handling**

### **Common Error Responses**
- **401 Unauthorized**: 
  - Missing or invalid `Authorization` header for protected routes.
  ```json
  {
    "error": "Access denied. No token provided."
  }
  ```
- **403 Forbidden**: 
  - Expired or invalid JWT token.
  ```json
  {
    "error": "Invalid or expired token."
  }
  ```
- **400 Bad Request**: 
  - Missing or invalid query parameters or request body.
  ```json
  {
    "error": "Query parameter 'q' is required."
  }
  ```

---

## **Usage Workflow**

1. **Register a User**:
   - `POST /api/auth/register`
   - Provide email and password in the request body.

2. **Log in to Get a JWT Token**:
   - `POST /api/auth/login`
   - Use the email and password to receive a token.

3. **Search for Images**:
   - `GET /api/images/search?q=<query>`
   - Include the token in the `Authorization` header.

---

## **Dependencies**

- **bcryptjs**: Hashes passwords for secure storage.
- **jsonwebtoken**: Creates and verifies JWT tokens for authentication.
- **dotenv**: Manages environment variables.
- **express**: Handles HTTP requests and routes.
- **axios**: Makes external API requests to image providers.

---
