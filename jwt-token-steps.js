/**
 * 1. after successfully logIn: genaret a JWT token
 * npm i jsonwebtoken, cookie-parser
 * jwt,sign(payload, secret, {expiresIn: '1h})
 * 
 * 
 * 
 * 
 * 2. send token (genaret in the server side) to the client side: 
 * local Storage ------> easier
 * session Strorage ---> 
 * httpOnly cookie ----> better option
 * 
 * 
 * 
 * 
 * 3. for sensitive or secure or private protected APIs: send token to the server side
 * 
 * // on the server side:  
 * app.use(cors({
   origin: ["http://localhost:5174"],
   credentials: true
   }));
 * 
 *
 * // in the client side:  
 * 
 * 
 * 
 * 
 * 
 * 4. valid the token in the server side: 
 * if valid: provite data
 * if not valid: logOut
 * 
 * 
 * 
*/
