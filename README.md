# Bitespeed

## Description
Bitespeed is a backend service designed to collect and manage contact details from shoppers to provide a personalized customer experience. The service addresses the challenge of linking different orders made with varying contact information to the same individual. This is achieved by maintaining a relational database table named **`Contact`** that consolidates and links contact information.

### Contact Table Structure
```tsx
{
	id                   Int                   
	phoneNumber          String?
	email                String?
	linkedId             Int? // the ID of another Contact linked to this one
	linkPrecedence       "secondary"|"primary" // "primary" if it's the first Contact in the link
	createdAt            DateTime              
	updatedAt            DateTime              
	deletedAt            DateTime?
}
```

One customer can have multiple **`Contact`** rows in the database against them. All of the rows are linked together with the oldest one being treated as "primary” and the rest as “secondary”.

## Installation
To install the project, clone the repository and run the following commands:

```bash
npm install
```

## Usage
To start the application, run:

```bash
npm start
```

The server will run on the specified port (default is 3000). You can change the port by setting the `PORT` environment variable.

## API Endpoints

### POST /identify
This endpoint is used to identify a contact. You need to send a JSON body with the required information.

**Request Body Example:**
```tsx
{
	"email"?: string,
	"phoneNumber"?: number
}
```

**Response Example:**
```tsx
{
	"contact":{
		"primaryContactId": number,
		"emails": string[], // first element being email of primary contact 
		"phoneNumbers": string[], // first element being phoneNumber of primary contact
		"secondaryContactIds": number[] // Array of all Contact IDs that are "secondary" to the primary contact
	}
}
```

## Testing with Postman
To check if the service is working properly, follow these steps:

1. **Open Postman** (or use cURL if you prefer).
2. **Create a New POST Request**:
   - Set the URL to: `http://localhost:3000/identify`.
3. **Set the Headers**:
   - Key: `Content-Type`
   - Value: `application/json`
4. **Set the Request Body**:
   - Click on the "Body" tab.
   - Select the "raw" radio button.
   - In the dropdown next to the "raw" option, select JSON.
   - Enter the JSON payload in the text area. For example:
   ```json
   {
     "email": "test@example.com",
     "phoneNumber": "0987654321"
   }
   ```
5. **Send the Request**:
   - Click the "Send" button to send the request to your server.

## Dependencies
- `@prisma/client`: ^6.3.1
- `dotenv`: ^16.4.7
- `express`: ^4.21.2
- `sqlite3`: ^5.1.7

## License
This project is licensed under the ISC License.
