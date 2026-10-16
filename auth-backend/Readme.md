1. auth folder :- Base URL: http://localhost:8083/api/v1/auth

    **1. POST — Register**
       POST URL: http://localhost:8083/api/v1/auth/register
       Setting	Value
       Authorization	No Auth
       Headers	Content-Type: application/json
       Body	raw → JSON
           {
           "name": "Test User",
           "email": "user@example.com",
           "password": "Test@123",
           "image": "",
           "enable": true
           }
    
    
    **2. POST — Login**
       POST URL: http://localhost:8083/api/v1/auth/login
       Setting	Value
       Authorization	No Auth
       Headers	Content-Type: application/json
       Body	raw → JSON
               {
               "email": "user@example.com",
               "password": "Test@123"
               }
        Login response থেকে accessToken copy করবে। Protected users requests-এ এই token লাগবে।
    
    
    3. POST — Refresh
       refresh URL: http://localhost:8083/api/v1/auth/refresh
       Setting	Value
       Authorization	No Auth
       Headers	Content-Type: application/json
       Body	raw → JSON
           {
           "refreshToken": "YOUR_REFRESH_TOKEN"
           } 
        এখানে login response-এর refreshToken ব্যবহার করবে। Valid refresh-token cookie থাকলে body ছাড়াও request করা সম্ভব।
    
       4. POST — Logout
          logout URL: http://localhost:8083/api/v1/auth/logout
          Setting	Value
          Authorization	No Auth
          Headers	Optional
          Body	সাধারণত লাগবে না
          Refresh token revoke করার জন্য তোমার controller যেভাবে token read করে, সেই অনুযায়ী refresh-token cookie বা X-Refresh-Token header পাঠাবে।

2. users folder(Admin Access need)
   Base URL: http://localhost:8083/api/v1/users,   এই folder-এর সব request-এ Admin-এর valid accessToken লাগবে, কারণ তোমার SecurityConfig-এ /api/v1/users/**-এর জন্য hasRole("ADMIN") আছে।
    
       5. POST — Create User
          create user URL: http://localhost:8083/api/v1/users
          Setting	Value
          Authorization	Bearer Token
          Token	Admin accessToken
          Headers	Content-Type: application/json
          Body	raw → JSON
          {
          "name": "New User",
          "email": "newuser@example.com",
          "password": "Test@123",
          "image": "",
          "enable": true
          }
    
    
    6. PUT — Update User
       PUT URL: http://localhost:8083/api/v1/users/USER_UUID
       Setting	Value
       Authorization	Bearer Token
       Token	Admin accessToken
       Headers	Content-Type: application/json
       Body	raw → JSON
       {
       "name": "Updated User",
       "email": "newuser@example.com",
       "password": "Test@123",
       "image": "",
       "enable": true
       }
    USER_UUID-এর জায়গায় যে user-কে update করবে তার actual ID বসাবে।
    
    
    7. GET — List Users
       list users URL: http://localhost:8083/api/v1/users
       Setting	Value
       Authorization	Bearer Token
       Token	Admin accessToken
       Body	None
       Content-Type	লাগবে না
       এটাই তোমার 403 error দেওয়া endpoint। Login করা account-এর ROLE_ADMIN না থাকলে 403 আসতে পারে।
    
    
    8. GET — Get Single By Email
       GET URL: http://localhost:8083/api/v1/users/email/user%40example.com
       Setting	Value
       Authorization	Bearer Token
       Token	Admin accessToken
       Body	None
       এখানে নিজের user-এর email-এর পরিবর্তে যে user-কে খুঁজবে তার email দেবে।
    
    
    9. GET — Get Single By User ID
       GET URL: http://localhost:8083/api/v1/users/USER_UUID
       Setting	Value
       Authorization	Bearer Token
       Token	Admin accessToken
       Body	None
       USER_UUID-এর জায়গায় database-এর actual user ID বসাবে।