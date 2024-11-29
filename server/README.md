# Kanban API Documentation

## Endpoints
List of available endpoints:
- `POST /login`
- `POST /login/google`


Routes below need authentication:

- `GET /notes`
- `POST /notes`
- `GET /notes/:id`
- `GET /statuses`

Routes below need authorization:
- `PUT /notes/:id`
- `DELETE /notes/:id`

&nbsp;

## 1. POST /login

Description:

- Login into the system

Request:

- body:

```json
{
  "email": "string"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Email is required"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Email is required"
}
```

&nbsp;

## 2. GET /notes

Description:

- Fetch all notes from database

Request

- headers:

```json
{
  "Authorization": "Bearer <string token>"
}
```

Response (200 - OK)

```json
[
    {
        "id": 1,
        "task": "Membuat API",
        "description": "Membuat endpoint API untuk fitur autentikasi",
        "userId": 1,
        "statusId": 1
    },
    {
        "id": 2,
        "task": "Desain UI",
        "description": "Mendesain halaman utama aplikasi dengan React",
        "userId": 2,
        "statusId": 2
    },
    {
        "id": 3,
        "task": "Testing",
        "description": "Melakukan testing API menggunakan Postman",
        "userId": 1,
        "statusId": 3
    }
]
```

&nbsp;

## 3. POST /notes

Description:

- Create a new product

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- body:

```json
{
  "task": "string",
  "description": "string",
}
```

_Response (201 - Created)_

```json
{
    "data": {
        "statusId": 1,
        "id": 5,
        "task": "Integrasi Frontend",
        "description": "Menghubungkan API dengan frontend menggunakan Axios",
        "userId": 1
    },
    "message": "Note Integrasi Frontend created"
}
```

_Response (400 - Bad Request)_

```json
{
    "message": "<key_note> required!"
}
```
&nbsp;

## 4. GET /notes/:id

Description:

- See detail note by id

Request:

- params:

```json
{
  "id": "integer"
}
```

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
{
    "id": 1,
    "task": "Membuat API",
    "description": "Membuat endpoint API untuk fitur autentikasi",
    "userId": 1,
    "statusId": 1
}
```


_Response (404 - Not Found)_

```json
{
    "message": "Note not found"
}
```
&nbsp;

## 5. GET /statuses

Description:

- Fetch all statuses from database

Request

- headers:

```json
{
  "Authorization": "Bearer <string token>"
}
```

Response (200 - OK)

```json
[
    {
        "id": 1,
        "name": "To Do",
        "createdAt": "2024-11-26T10:27:58.390Z",
        "updatedAt": "2024-11-26T10:27:58.390Z"
    },
    {
        "id": 2,
        "name": "In Progress",
        "createdAt": "2024-11-26T10:27:58.390Z",
        "updatedAt": "2024-11-26T10:27:58.390Z"
    },
    {
        "id": 3,
        "name": "Completed",
        "createdAt": "2024-11-26T10:27:58.390Z",
        "updatedAt": "2024-11-26T10:27:58.390Z"
    }
]
```

&nbsp;
## 6. PUT /notes/:id

- Description:

- Edit statuses from database by id

Request

- headers:

```json
{
  "Authorization": "Bearer <string token>"
}
```

- params:

```json
{
  "id": "integer"
}
```

Response (200 - OK)

```json
{
    "data": {
        "id": 5,
        "task": "Integrasi Frontend",
        "description": "Menghubungkan API dengan frontend menggunakan Axios",
        "userId": 1,
        "statusId": 1
    },
    "message": "Note Integrasi Frontend update"
}
```

Response (404 - Not Found)

```json
{
    "message": "Note Not Found"
}
```

Response (403 - Forbidden)

```json
{
    "message": "Forbidden Access"
}
```

&nbsp;

## 7. DELETE /gifts/:id

Description:

- Delete Gift
- Authorization : recipient's ownership

Request

- headers:

```json
{
  "Authorization": "Bearer <string token>"
}
```

- params:

```json
{
  "id": "integer"
}
```

Response (200 - OK)

```json
{
    "message": "Note Integrasi Frontend success to delete"
}
```

Response (404 - Not Found)

```json
{
    "message": "Note Not Found"
}
```
&nbsp;

## Global Error

Response (401 - Unauthorized)

```json
{
  "message": "Invalid token"
}
```

Response (403 - Forbidden)

```json
{
  "message": "You are not authorized"
}
```

Response (500 - Internal Server Error)

```json
{
  "message": "Internal server error"
}
```


