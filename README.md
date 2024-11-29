### **README: User Management API**

---

#### **Overview**
This application is a **User Management API** built using the following technologies:
- **Express.js**: For building the RESTful API.
- **Sequelize ORM**: To interact with a **MySQL** database.
- **MySQL2**: For database connection and queries.
- **JWT (JSON Web Token)**: For user authentication and token generation.
- **bcrypt**: For securely hashing user passwords.

The API supports functionalities like user registration, authentication, retrieving users, filtering, pagination, and activity tracking.

---

#### **Features**
1. **User Registration**:
   - Hashes passwords securely using `bcrypt`.
   - Stores user details (name, email, role, password) in the database.

2. **User Login**:
   - Verifies credentials using `bcrypt` for password comparison.
   - Generates a JWT for authenticated sessions.

3. **Get All Users**:
   - Retrieves a paginated list of users.
   - Allows filtering by name, email, and verification status.

4. **Inactive Users**:
   - Identifies users who haven’t logged in within a specific time frame (e.g., 4 hours, 1 month).

5. **Top Users by Login Frequency**:
   - Retrieves the top 3 most active users based on login frequency.

6. **Security**:
   - Prevents SQL injection using Sequelize’s query parameterization.
   - Passwords are securely hashed before storage.

---

#### **Technologies Used**
- **Backend Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MySQL](https://www.mysql.com/)
- **ORM**: [Sequelize](https://sequelize.org/)
- **Password Hashing**: [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Authentication**: [jsonwebtoken (JWT)](https://github.com/auth0/node-jsonwebtoken)

