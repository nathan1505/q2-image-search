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
Replace `your_unsplash_api_key`, `your_pixabay_api_key`, `your_storyblocks_api_key` with your actual API keys and a secure secret for JWT.
4. **Run the Server:**
    ```bash
    node server/app.js
    ```
The server will start at `http://localhost:3000`.

---

## **Dependencies**

- **bcryptjs**: Hashes passwords for secure storage.
- **jsonwebtoken**: Creates and verifies JWT tokens for authentication.
- **dotenv**: Manages environment variables.
- **express**: Handles HTTP requests and routes.
- **axios**: Makes external API requests to image providers.
- **apollo-server-express**: To interact with the API in your application

---

## **Making Queries**

Url start with `graphql`

### **Basic Query Example**

To fetch data, use a `query`. For example:

```graphql
query {
  searchImages(query: "nature") {
    image_ID
    thumbnails
    preview
    title
    source
    tags
  }
}
```

### **Expected JSON Response**
```json
{
  "data": {
    "searchImages": [
      {
        "image_ID": "1",
        "thumbnails": "https://example.com/thumb1.jpg",
        "preview": "https://example.com/preview1.jpg",
        "title": "Image 1",
        "source": "Internal Database",
        "tags": ["nature", "forest"]
      },
      {
        "image_ID": "2",
        "thumbnails": "https://example.com/thumb2.jpg",
        "preview": "https://example.com/preview2.jpg",
        "title": "Image 2",
        "source": "Internal Database",
        "tags": ["city", "architecture"]
      }
    ]
  }
}
```

---

## **Making Mutations**

To modify data, use a `mutation`. For example:

### **Register a New User**
```graphql
mutation {
  register(email: "user@example.com", password: "securepassword")
}
```

### **Login to Get a Token**
```graphql
mutation {
  login(email: "user@example.com", password: "securepassword") {
    token
    message
  }
}
```

### **Expected JSON Response**
```json
{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "message": "Login successful."
    }
  }
}
```

---

## **Authentication**

If the API requires authentication, include a token in the `Authorization` header with the `Bearer` prefix.

### Example Header:
```
Authorization: Bearer <your-jwt-token>
```

---

## **Error Handling**

When interacting with a GraphQL API, you may encounter errors. Here’s what typical error responses look like:

### **Example: Missing Authorization Header**
```json
{
  "errors": [
    {
      "message": "Access denied. No token provided."
    }
  ]
}
```

### **Example: Invalid Query**
```json
{
  "errors": [
    {
      "message": "Cannot query field 'invalidField' on type 'Image'."
    }
  ]
}
```
