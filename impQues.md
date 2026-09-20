# AI-RESULYZER — Interview Questions & Answers

> **Purpose:** Interview-preparation notes for the AI-RESULYZER project.
>
> **Important:** These answers are based on the **current code in the repository**. Do not claim a technology was used if the current implementation does not actually use it. In particular, the README mentions Puppeteer, but the current resume-PDF generation path uses **PDFKit**, not Puppeteer. Also, the upload middleware accepts PDF/DOCX, while the current controller extracts text with `pdf-parse`, so be prepared to explain that DOCX parsing is an area that can be improved.

---

# 0. Project Story — Must Know

## Q1. Tell me about your project.

**Answer:**

AI-RESULYZER is a full-stack MERN-based application that helps a candidate prepare for a specific job interview.

The user provides a **job description** and either a **resume PDF** or a **self-description**. The backend extracts the resume text, combines it with the job description and candidate information, and sends the data to **Google Gemini**.

Gemini generates a structured interview report containing:

- Match score
- Technical interview questions
- Behavioral interview questions
- Skill gaps
- Preparation roadmap

The generated report is stored in MongoDB so the user can access previous reports later.

The application also supports authentication using email/password and Google sign-in, protected routes, report history, report deletion, and generation of a tailored resume PDF.

---

## Q2. Why did you build this project?

**Answer:**

The idea came from a common problem: candidates usually have a resume and a job description, but they don't know exactly how well their profile matches the role or what interview topics they should prepare.

I wanted to build a system where the candidate could give the **actual job description + their profile**, and the application would generate preparation material specifically for that role instead of giving generic interview questions.

---

## Q3. What problem does it solve?

**Answer:**

It reduces the gap between:

**"What is written in the job description?"**

and

**"What should I actually prepare for this interview?"**

Instead of manually comparing a resume with a job description, the system uses an LLM to generate a structured preparation plan.

---

## Q4. Explain the complete workflow.

**Answer:**

The high-level flow is:

**React UI**
→ User enters job description + resume/self-description  
→ **Axios/API request**
→ **Express route**
→ **JWT authentication middleware**
→ **Multer file upload middleware**
→ **Interview controller**
→ Extract resume text using **pdf-parse**
→ Validate generation preferences
→ **AI service**
→ **Google Gemini**
→ Structured JSON response
→ Save report using **Mongoose**
→ **MongoDB**
→ Return JSON response
→ React displays the report.

For resume PDF generation:

**Saved report**
→ Backend gets resume + job description + self-description  
→ Gemini generates resume HTML  
→ HTML is converted into PDF using **PDFKit**
→ PDF buffer is returned to the frontend.

---

# 1. Architecture — Very Important

## Q5. What architecture did you use?

**Answer:**

I used a typical **client-server architecture**.

The frontend is a React application and the backend is a Node.js + Express REST API.

The backend is separated into:

- Routes
- Controllers
- Middleware
- Services
- Models
- Configuration

This separation makes the code easier to maintain.

---

## Q6. Why did you separate routes, controllers, services and models?

**Answer:**

I wanted to keep each layer responsible for one type of work.

- **Routes** decide which endpoint should be called.
- **Middleware** handles cross-cutting logic such as authentication and file upload.
- **Controllers** handle request/response logic.
- **Services** contain business logic such as communication with Gemini.
- **Models** define the MongoDB data structure.
- **Config** handles environment variables and database connection.

For example, the interview route does not contain Gemini logic. It calls the controller, and the controller calls the AI service.

---

## Q7. Why not put everything inside one controller?

**Answer:**

Putting everything in one controller would make it large and difficult to test or maintain.

For example, Gemini prompt generation is independent from HTTP request handling, so I placed it inside `ai.service.js`.

This also makes it easier to replace Gemini later without rewriting the complete controller.

---

# 2. Tech Stack — Must Know

## Q8. Why did you choose React?

**Answer:**

I chose React because the application has a dynamic UI where data changes frequently.

For example:

- Loading states
- Login state
- Interview reports
- Technical/behavioral question sections
- Roadmap sections
- Error messages

React's component-based architecture makes these UI parts easier to manage and reuse.

---

## Q9. Why React instead of plain JavaScript?

**Answer:**

Plain JavaScript can build the application, but as the UI becomes larger, managing state and reusable UI becomes harder.

React provides:

- Component-based development
- State management
- Efficient UI updates
- Routing integration
- Easier reuse of UI logic

---

## Q10. Why did you use Vite?

**Answer:**

Vite provides a fast development server and fast frontend build process.

It is lightweight and works well with modern React applications.

---

## Q11. Why Node.js?

**Answer:**

Node.js allows me to use JavaScript on the backend as well as the frontend.

It is also suitable for this application because the backend performs many I/O operations such as:

- Database requests
- API calls to Gemini
- File processing
- Authentication-related operations

Node.js uses an asynchronous, event-driven model, which works well for these operations.

---

## Q12. Why Express.js?

**Answer:**

Express provides a simple way to build REST APIs in Node.js.

In my project I use it for:

- Routes
- Middleware
- Request/response handling
- Authentication middleware
- File upload middleware

For example:

`POST /api/interview/`

is an Express route used to generate an interview report.

---

## Q13. Why MongoDB?

**Answer:**

MongoDB fits this project because the AI-generated report contains nested and variable-length data.

For example:

- Technical questions are an array.
- Behavioral questions are an array.
- Skill gaps are an array.
- Preparation plan is an array.

MongoDB's document-oriented structure maps naturally to this data.

---

## Q14. Why MongoDB instead of MySQL?

**Answer:**

A relational database could also be used, but the report contains nested structures such as question objects containing question, intention and answer.

With MongoDB, this structure can be represented naturally inside one document.

I chose MongoDB because it simplified the data model for this particular application.

---

## Q15. Why Mongoose?

**Answer:**

Mongoose provides an ODM layer over MongoDB.

It lets me define schemas, validation and relationships more clearly.

For example, my interview report schema defines:

- `matchScore`
- `technicalQuestions`
- `behavioralQuestions`
- `skillGaps`
- `preparationPlan`
- `user`

---

## Q16. Why Gemini?

**Answer:**

The core feature of my project is generating contextual interview preparation from a resume and job description.

An LLM is suitable because it can understand unstructured natural language and generate contextual questions, explanations and preparation plans.

I integrated Google Gemini through the Google GenAI SDK.

---

## Q17. Why not train your own model?

**Answer:**

Training a model from scratch would require a large dataset, significant compute resources and a much larger development effort.

The goal of this project was to build a useful end-to-end AI application, so using an existing LLM API allowed me to focus on:

- Application architecture
- Prompt design
- Input processing
- Structured output
- Authentication
- Database persistence
- User experience

---

## Q18. Why use an LLM instead of keyword matching?

**Answer:**

Simple keyword matching can identify exact words, but it may miss semantic relationships.

For example, a resume might say:

"Built server-side APIs using Express."

while a job description may say:

"Experience with backend REST services."

An LLM can understand the relationship better than exact string matching.

---

# 3. AI / Gemini — Extremely Important

## Q19. How exactly are you using Gemini?

**Answer:**

I created an AI service in:

`Backend/src/services/ai.service.js`

The service receives:

- Resume text
- Self-description
- Job description
- Roadmap duration
- Technical question count
- Behavioral question count

These are inserted into the Gemini prompt.

Gemini then returns a structured JSON response containing:

- Match score
- Technical questions
- Behavioral questions
- Skill gaps
- Preparation plan
- Job title

---

## Q20. What is prompt engineering in your project?

**Answer:**

Prompt engineering means designing the input instructions given to the LLM so that the output is useful and consistent.

For example, I explicitly tell Gemini:

- How many technical questions to generate
- How many behavioral questions to generate
- How long the roadmap should be
- What information the candidate provided

This reduces ambiguity in the output.

---

## Q21. Why do you request JSON from Gemini?

**Answer:**

Because the frontend needs structured data.

Instead of receiving one large paragraph, I need separate fields such as:

`matchScore`

`technicalQuestions`

`behavioralQuestions`

`skillGaps`

`preparationPlan`

JSON makes it easy for the backend to save the result in MongoDB and for React to render each section separately.

---

## Q22. What is Zod and why did you use it?

**Answer:**

Zod is a schema validation library for JavaScript.

I define the expected structure of Gemini's response using Zod.

For example, a technical question must contain:

- `question`
- `intention`
- `answer`

This helps enforce a predictable response structure.

---

## Q23. What is `zodToJsonSchema` doing?

**Answer:**

Gemini accepts a JSON schema for structured output.

I define the schema using Zod because it is convenient in JavaScript, then convert that Zod schema into JSON Schema using:

`zodToJsonSchema(interviewReportSchema)`

That schema is passed to Gemini through `responseSchema`.

So the flow is:

**Zod schema → JSON Schema → Gemini structured response**

---

## Q24. Why not just ask Gemini to return JSON in the prompt?

**Answer:**

Simply writing "return JSON" is less reliable because the model could produce malformed or inconsistent output.

Using a response schema gives the model a more explicit structure to follow.

It also makes the expected data model visible in code.

---

## Q25. What happens if Gemini returns invalid JSON?

**Answer:**

The service currently calls:

`JSON.parse(response.text)`

inside a try/catch.

If parsing or the Gemini request fails, the error is caught and passed through the error-handling logic.

For a production-scale system, I would additionally add retry logic, logging and stronger validation before storing the result.

---

## Q26. How do you handle Gemini rate limits?

**Answer:**

I created:

`isRateLimitError()`

which checks for HTTP status 429 and messages such as quota/resource exhaustion.

The controller then returns HTTP **429** with a user-friendly message.

This prevents a Gemini quota problem from appearing as a generic server error.

---

# 4. Resume Upload & Parsing

## Q27. How does resume upload work?

**Answer:**

The frontend sends the resume as multipart form data.

The route uses:

`upload.single("resume")`

Multer receives the file and stores it in memory using:

`memoryStorage()`

The controller then accesses:

`req.file.buffer`

and extracts text from the PDF.

---

## Q28. Why did you use Multer?

**Answer:**

Express does not directly parse multipart file uploads.

Multer is middleware designed for handling multipart/form-data.

It gives me access to information such as:

- File buffer
- Original filename
- MIME type
- File size

---

## Q29. Why use memory storage?

**Answer:**

The application only needs the uploaded resume temporarily to extract its text.

There is no need to permanently store the original file on the server for the current report-generation flow.

So storing the file in memory avoids unnecessary disk I/O.

However, for very large files or high traffic, I would move to object storage such as S3/GCS and process files asynchronously.

---

## Q30. What file restrictions do you have?

**Answer:**

The upload middleware limits files to **5 MB**.

It checks allowed MIME types and filename extensions for PDF and DOCX.

The frontend also accepts PDF and DOCX.

---

## Q31. How is the PDF text extracted?

**Answer:**

In the interview controller, if a file buffer exists, I pass the buffer to `pdf-parse`.

The extracted text is then stored in:

`resumeText`

That text becomes one of the inputs to the Gemini prompt.

---

## Q32. I noticed DOCX is allowed. Can your current controller parse DOCX correctly?

**Answer:**

The upload middleware allows DOCX, but the current controller uses `pdf-parse` for extraction.

So the current implementation is primarily handling PDF extraction.

A production improvement would be to detect the MIME type and use a DOCX parser such as `mammoth` for DOCX files.

This is an important limitation I should be honest about rather than claiming DOCX parsing is already implemented.

---

# 5. REST API — Must Know

## Q33. What is REST API?

**Answer:**

REST is an architectural style for building APIs around resources and HTTP methods.

In my project examples include:

- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/auth/get-me`
- `POST /api/interview/`
- `GET /api/interview/`
- `GET /api/interview/report/:interviewId`
- `DELETE /api/interview/:interviewId`

---

## Q34. Why POST for generating an interview report?

**Answer:**

Generating a report is an operation that creates a new resource.

The request also contains substantial input data such as job description, self-description and an optional uploaded file.

Therefore POST is appropriate.

---

## Q35. Why GET for fetching a report?

**Answer:**

GET is intended for retrieving data without creating or modifying a resource.

For example:

`GET /api/interview/report/:interviewId`

retrieves a specific saved report.

---

## Q36. Why DELETE for deleting reports?

**Answer:**

DELETE clearly represents removing a resource.

The API:

`DELETE /api/interview/:interviewId`

deletes the report only if it belongs to the authenticated user.

---

# 6. Authentication — Very Important

## Q37. How does normal login work?

**Answer:**

The user submits email and password.

The backend:

1. Finds the user by email.
2. Compares the password using bcrypt.
3. Creates a JWT using `jwt.sign()`.
4. Stores the token in an HTTP-only cookie.
5. Returns the user information.

---

## Q38. Why bcrypt?

**Answer:**

Passwords should not be stored as plain text.

bcrypt hashes the password before storing it.

During login, the entered password is compared with the stored hash using:

`bcrypt.compare()`

So the original password does not need to be stored.

---

## Q39. What is JWT?

**Answer:**

JWT stands for JSON Web Token.

After successful authentication, the server signs a token containing information such as the user's ID.

The client sends the token with future requests.

The server verifies the token to identify the user.

---

## Q40. What is inside your JWT?

**Answer:**

The token payload currently contains:

- `id`
- `username`

The token is signed using the server-side JWT secret and expires after one day.

---

## Q41. How does `authUser` middleware work?

**Answer:**

The middleware first looks for a Bearer token in the Authorization header.

If it is not present, it checks the cookie.

Then it:

1. Checks whether the token is blacklisted.
2. Verifies the JWT signature.
3. Stores the decoded user information in `req.user`.
4. Calls `next()`.

This means controllers can use:

`req.user.id`

to know which user made the request.

---

## Q42. Why middleware for authentication?

**Answer:**

Authentication is required by multiple routes.

Instead of repeating authentication code inside every controller, I put it in reusable middleware.

For example:

`authUser`

can protect all private interview routes.

---

# 7. Google Login — Must Know

## Q43. How does Google login work in your project?

**Answer:**

The frontend initiates Google sign-in and obtains a Google access token.

It sends that access token to:

`POST /api/auth/google`

The backend then:

1. Receives the Google access token.
2. Calls Google's tokeninfo endpoint.
3. Verifies that the token audience matches my configured Google client ID.
4. Calls Google's userinfo endpoint.
5. Gets the user's Google profile.
6. Requires a verified email.
7. Finds an existing user using Google ID or email.
8. Creates a user if necessary.
9. Creates my application's JWT.
10. Sends the JWT back and sets it in a cookie.

So Google authenticates the user, but my application still creates its own JWT for subsequent API access.

---

## Q44. Why do you need your own JWT if Google already gives a token?

**Answer:**

The Google access token represents authorization with Google services.

My application's backend needs its own authentication mechanism for identifying users and protecting my own API routes.

Therefore, after verifying the Google token, I create an application-specific JWT.

---

## Q45. What happens if the user already exists?

**Answer:**

The backend searches by Google ID or email.

If the user already exists, it updates relevant Google information such as Google ID/avatar if needed and then creates the application's JWT.

---

## Q46. What happens if the user selects a Google account?

**Answer:**

The Google sign-in UI lets the user choose which Google account to authenticate with.

After permission/authentication, Google provides the application with the token representing that signed-in account.

My backend verifies the token and obtains the associated verified profile information.

---

# 8. Logout & Token Blacklisting

## Q47. How does logout work?

**Answer:**

When the user logs out:

1. The backend reads the current token.
2. Stores that token in the blacklist collection.
3. Clears the authentication cookie.

This prevents the logged-out JWT from being accepted again by the authentication middleware.

---

## Q48. Why blacklist JWTs if they expire?

**Answer:**

JWTs are normally stateless, so a valid token remains valid until expiry.

If a user logs out before expiry, simply deleting the client cookie does not automatically invalidate a copied token.

The blacklist gives the server a way to reject that token before its normal expiration.

---

## Q49. What is the disadvantage of token blacklisting?

**Answer:**

The server must check the blacklist database for every authenticated request.

As traffic grows, this creates extra database reads.

For a larger system, I could use:

- Short-lived access tokens
- Refresh tokens
- Redis for blacklist/revocation data
- Token IDs with TTL

---

# 9. MongoDB Data Model

## Q50. What collections/models do you have?

**Answer:**

The project currently has models for:

- Users
- Interview reports
- Blacklisted tokens

The main application data is stored in the interview report document.

---

## Q51. What is inside an InterviewReport?

**Answer:**

It contains:

- Job description
- Resume text
- Self-description
- Match score
- Technical questions
- Behavioral questions
- Skill gaps
- Preparation plan
- User reference
- Job title
- Roadmap duration
- Created/updated timestamps

---

## Q52. How do you associate a report with a user?

**Answer:**

The report has a `user` field containing a MongoDB ObjectId referencing the user.

When creating a report, I store:

`user: req.user.id`

When fetching a report, I query using both:

`_id: interviewId`

and

`user: req.user.id`

This is important because a user should only access their own report.

---

## Q53. Why check user ID in the database query?

**Answer:**

Authentication alone proves that the user is logged in.

It does not automatically prove that a particular report belongs to that user.

So I use:

`findOne({ _id: interviewId, user: req.user.id })`

This provides ownership-level authorization.

---

# 10. Validation & Security

## Q54. How do you validate Gemini generation preferences?

**Answer:**

I validate:

- Roadmap duration
- Roadmap unit
- Technical question count
- Behavioral question count

The current limits are:

- Maximum roadmap: **48 months / 4 years**
- Maximum technical questions: **50**
- Maximum behavioral questions: **50**

This prevents unreasonable requests from reaching the AI service.

---

## Q55. Why put limits on AI-generated questions?

**Answer:**

Because LLM calls consume API quota and resources.

Without limits, a user could request an extremely large number of questions, causing:

- High API usage
- Slow responses
- Higher cost
- Larger database documents
- Poor user experience

---

## Q56. Why use environment variables?

**Answer:**

Sensitive configuration should not be hardcoded into source code.

The project reads values such as:

- MongoDB URI
- JWT secret
- Gemini API key
- Google client ID

from environment variables.

This also allows development and production environments to use different configuration values.

---

## Q57. Why use CORS?

**Answer:**

The frontend and backend can run on different origins.

CORS allows the backend to control which cross-origin requests are accepted.

The project also enables credentials because authentication uses cookies.

---

## Q58. What security improvements would you make?

**Answer:**

I would improve several areas for production:

1. Restrict CORS to the exact frontend origin instead of broadly allowing origins.
2. Add rate limiting per user/IP.
3. Add stronger request validation.
4. Add security headers such as Helmet.
5. Add file-content validation rather than relying only on MIME type/extension.
6. Use secure cookie settings in production.
7. Add expiration/TTL cleanup for blacklisted tokens.
8. Avoid logging sensitive information.
9. Add centralized error handling.
10. Store uploaded files in secure object storage rather than keeping large files in memory.

---

# 11. PDF Resume Generation

## Q59. How does resume generation work?

**Answer:**

The user opens a saved interview report and clicks Download Resume.

The frontend requests:

`POST /api/interview/resume/pdf/:interviewReportId`

The backend:

1. Finds the report belonging to the authenticated user.
2. Gets the saved resume, job description and self-description.
3. Sends those inputs to Gemini.
4. Gemini returns structured HTML.
5. The backend converts that HTML into a PDF.
6. The PDF buffer is returned with `Content-Type: application/pdf`.

---

## Q60. Which library actually generates the PDF?

**Answer:**

In the current implementation, the PDF is generated using **PDFKit**.

The service imports:

`const PDFDocument = require("pdfkit")`

and converts the generated HTML into resume blocks before creating the PDF.

**Important:** The README mentions Puppeteer, but the current code path does not use Puppeteer for this operation.

---

## Q61. Why could Puppeteer be useful here?

**Answer:**

Puppeteer would be useful if I wanted the browser's HTML/CSS rendering engine to convert a designed HTML resume directly into a PDF.

That would make complex CSS layouts easier to reproduce.

However, my current implementation uses PDFKit, which gives me direct programmatic control over PDF generation.

---

## Q62. PDFKit vs Puppeteer — what would you say?

**Answer:**

PDFKit is a PDF-generation library where I programmatically place text and elements.

Puppeteer launches a Chromium browser and can print HTML/CSS into a PDF.

For a simple ATS-friendly resume, PDFKit is sufficient.

If the resume design required complex CSS, exact browser rendering, columns or advanced HTML layouts, Puppeteer could be considered.

---

# 12. Frontend Questions

## Q63. How does React communicate with the backend?

**Answer:**

The frontend uses HTTP API requests through Axios.

For example, generating an interview report sends the user's inputs to the backend API.

The backend returns JSON, and React updates the UI using the returned data.

---

## Q64. Why Axios instead of fetch?

**Answer:**

Both are valid.

Axios provides convenient features such as:

- Simple request syntax
- Automatic JSON handling
- Interceptors
- Consistent error handling
- Easy configuration

I chose Axios for API communication in the frontend.

---

## Q65. How are protected frontend routes handled?

**Answer:**

I created a reusable `Protected` component.

It checks the authentication state.

If the user is not authenticated, it redirects to:

`/login`

If the user is authenticated, it renders the requested page.

---

## Q66. Is frontend protection enough for security?

**Answer:**

No.

Frontend protection is mainly for user experience.

The real security boundary is the backend.

That is why the backend also uses `authUser` middleware on private API routes.

---

# 13. Important JavaScript / Node Keywords

## Q67. What is middleware?

**Answer:**

Middleware is a function that runs during the request-response cycle before the final controller.

In my project:

- `authUser` checks authentication.
- `upload.single("resume")` handles file upload.

Middleware can inspect or modify the request and either end the response or call `next()`.

---

## Q68. What is async/await?

**Answer:**

`async/await` is syntax for working with Promises.

My backend uses it for operations that take time, such as:

- MongoDB queries
- Gemini API requests
- PDF parsing

Example:

`const report = await interviewReportModel.findOne(...)`

The function waits for the Promise result before continuing.

---

## Q69. Why is the controller async?

**Answer:**

Because it performs asynchronous operations such as:

- Reading/parsing the uploaded file
- Calling Gemini
- Writing to MongoDB

Using `async/await` makes this flow easier to read.

---

## Q70. What is `req` and `res` in Express?

**Answer:**

`req` is the incoming HTTP request.

It contains things such as:

- Body
- Headers
- Cookies
- Parameters
- Uploaded file

`res` is the HTTP response used to send data/status codes back to the client.

---

## Q71. What is `req.params`?

**Answer:**

It contains route parameters.

For example:

`GET /api/interview/report/:interviewId`

The value of `interviewId` is available through:

`req.params.interviewId`

---

## Q72. What is `req.body`?

**Answer:**

It contains data sent in the HTTP request body.

In my project it contains values such as:

- Job description
- Self-description
- Roadmap preferences
- Question counts

---

## Q73. What is `req.file`?

**Answer:**

It is provided by Multer when a file is uploaded.

In my project:

`req.file.buffer`

contains the uploaded resume in memory.

---

# 14. Challenges — Answer Carefully

## Q74. What challenges did you face while building this project?

**Answer template:**

One major challenge was making the AI output predictable enough for the application to consume.

An LLM naturally generates free-form text, but my frontend and database require structured fields.

I addressed this by using a Zod schema and Gemini's structured JSON response configuration.

Other practical challenges included:

- Handling uploaded resume files
- Authentication and protected APIs
- Google sign-in integration
- Handling Gemini rate limits
- Validating user generation preferences
- Storing nested AI-generated data in MongoDB
- Generating a downloadable PDF

**Do not invent a specific bug or performance number unless you actually experienced it.**

---

## Q75. What was the hardest technical part?

**Answer:**

The AI integration was one of the more important technical challenges because the model output had to fit the application's expected structure.

Instead of treating Gemini as a text generator only, I designed a schema for the expected report and used structured output.

---

## Q76. What problem did you face with AI reliability?

**Answer:**

LLM output can be inconsistent if the expected structure is not clearly defined.

The solution was to explicitly define the output structure using Zod and pass its JSON Schema representation to Gemini.

I also validate generation parameters before making the AI request.

---

# 15. Outcomes — Do NOT Invent Numbers

## Q77. What was the outcome of the project?

**Answer:**

The result is a working end-to-end application where a user can:

1. Create/login to an account.
2. Sign in with Google.
3. Provide a job description.
4. Upload a resume or provide a self-description.
5. Generate an AI interview report.
6. View technical and behavioral questions.
7. View skill gaps.
8. View a preparation roadmap.
9. Save reports in MongoDB.
10. Reopen previous reports.
11. Delete reports.
12. Generate/download a tailored resume PDF.

If the interviewer asks for exact user numbers, response time, accuracy or improvement percentage, I should give only measurements I have actually recorded.

---

# 16. Scaling — Very Important

## Q78. How would you scale this application to 100,000 users?

**Answer:**

I would separate the application into independently scalable components.

### 1. Frontend

Keep the React frontend on a CDN.

### 2. Backend

Run multiple Node.js instances behind a load balancer.

### 3. Database

Use MongoDB Atlas with:

- Proper indexes
- Connection pooling
- Read replicas where useful
- Monitoring

### 4. AI generation

Move expensive Gemini requests into a background job system.

For example:

**API → Queue → Worker → Gemini → MongoDB**

This prevents a long AI request from blocking normal API traffic.

### 5. File storage

Move resume files to object storage such as S3/GCS instead of keeping large files in server memory.

### 6. Caching

Use Redis for frequently accessed data and rate limiting.

### 7. Monitoring

Add:

- Request logs
- Error tracking
- API latency metrics
- AI usage metrics
- Database monitoring

---

## Q79. Why would you use a queue for AI generation?

**Answer:**

AI generation can take longer than normal CRUD operations.

Instead of keeping an HTTP request open for a long time, I could:

1. Create a generation job.
2. Put it in a queue.
3. Return a job ID.
4. A worker calls Gemini.
5. The worker saves the result.
6. The frontend checks status or receives an event.

This improves reliability and allows multiple workers to process jobs.

---

## Q80. How would you reduce Gemini API cost?

**Answer:**

I would:

- Limit input size
- Limit output size
- Avoid sending unnecessary resume content
- Cache repeated analyses
- Use smaller/cheaper models when quality is sufficient
- Queue and batch suitable workloads
- Prevent duplicate requests
- Rate-limit users

---

## Q81. How would you improve response time?

**Answer:**

I would identify where the latency comes from first.

Likely expensive operations include:

- Resume parsing
- Gemini generation
- PDF generation

Then I could use:

- Background jobs
- Streaming where supported
- Smaller prompts
- Caching
- Parallel independent operations
- Faster model configurations
- Object storage for files

---

# 17. Database Scaling

## Q82. What indexes would you add?

**Answer:**

I would consider indexes based on actual query patterns.

For interview reports, a useful index would likely be around:

`user + createdAt`

because the application frequently retrieves reports belonging to a user and sorts them by creation time.

I would confirm this with query profiling before adding unnecessary indexes.

---

## Q83. Why not index every field?

**Answer:**

Indexes speed up reads but consume storage and can slow down writes.

Therefore indexes should be based on actual query patterns.

---

# 18. API & Error Handling

## Q84. What HTTP status codes do you use?

**Answer:**

Examples include:

- **200** — successful GET/delete-style operation
- **201** — interview report successfully created
- **400** — invalid request
- **401** — authentication failure
- **404** — report not found
- **429** — AI rate limit
- **500** — unexpected server error

---

## Q85. Why return 201 for report generation?

**Answer:**

Because generating the report creates a new interview-report resource in the database.

HTTP 201 represents successful resource creation.

---

## Q86. How do you handle errors from Gemini?

**Answer:**

The AI service catches errors and normalizes rate-limit errors.

The controller converts those into appropriate HTTP responses.

For example, a Gemini quota problem becomes HTTP 429.

Other unexpected errors become an appropriate server error response.

---

# 19. Design Decisions / "Why This, Not That?"

## Q87. Why REST API instead of GraphQL?

**Answer:**

This application has relatively straightforward resource operations:

- Create report
- Get report
- Get reports
- Delete report
- Authenticate user

REST maps naturally to these operations.

GraphQL could be useful if clients needed highly flexible nested queries, but it would add complexity that was not necessary for this project's current requirements.

---

## Q88. Why JWT instead of server-side sessions?

**Answer:**

JWT allows the API to authenticate requests without storing the complete session state on the server.

It works naturally with REST APIs and can be sent through a cookie or Authorization header.

However, JWT is not automatically better in every situation. Server-side sessions can be easier to revoke and manage centrally.

In this project, JWT fit the API authentication design.

---

## Q89. Why use HTTP-only cookies?

**Answer:**

An HTTP-only cookie cannot be read directly by client-side JavaScript.

That reduces exposure of the authentication token to JavaScript-based token theft such as certain XSS scenarios.

In production, I would also use appropriate `Secure` and `SameSite` settings.

---

## Q90. Why support both cookie and Bearer token?

**Answer:**

The middleware checks for a Bearer token first and falls back to the cookie.

This makes the backend flexible for different clients.

The browser application can use the cookie, while another client could use the Authorization header.

---

# 20. Code-Level Questions Interviewers Can Ask

## Q91. Explain this line:

`interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController)`

**Answer:**

This defines the report-generation endpoint.

The request passes through middleware in this order:

1. **authUser** — verifies the user.
2. **upload.single("resume")** — processes the uploaded resume.
3. **generateInterViewReportController** — generates and stores the report.

The order matters because the controller expects authentication information and the uploaded file to already be available.

---

## Q92. Why is authentication before file upload?

**Answer:**

There is no reason to process a potentially large file if the user is not authenticated.

Putting authentication first lets unauthorized requests fail before file processing.

This can save server resources.

---

## Q93. Explain this:

`findOne({ _id: interviewId, user: req.user.id })`

**Answer:**

It searches for a report that satisfies both conditions:

- Its ID matches the requested report.
- Its owner matches the logged-in user.

This prevents one authenticated user from retrieving another user's report simply by changing the report ID.

---

## Q94. Why use `timestamps: true` in Mongoose?

**Answer:**

Mongoose automatically maintains:

- `createdAt`
- `updatedAt`

This is useful for displaying when an interview plan was created and for sorting recent reports.

---

## Q95. Why use nested schemas for questions?

**Answer:**

Each question has multiple related properties:

- Question
- Intention
- Answer

A nested schema keeps these properties together and gives the database a predictable structure.

---

# 21. Limitations — Be Honest

## Q96. What are the current limitations?

**Answer:**

Some important limitations are:

1. AI output quality depends on the underlying model and input quality.
2. The current PDF text extraction path is designed around PDF parsing.
3. The upload middleware accepts DOCX, but DOCX text extraction should be implemented separately.
4. Gemini API quota can limit generation.
5. The current architecture is suitable for a project/demo scale but would need queues, caching and stronger infrastructure for very large traffic.
6. The application should use stricter production CORS/security settings.
7. Blacklisted JWTs should have a cleanup/TTL strategy.
8. The current PDF generation uses PDFKit rather than browser-based HTML rendering.

---

# 22. Future Improvements

## Q97. What would you add next?

**Answer:**

I would add:

- Proper DOCX parsing
- Background AI-generation queues
- Redis caching
- Stronger rate limiting
- Resume version history
- More robust ATS analysis
- Better resume parsing
- Model evaluation against a test dataset
- Feedback collection from users
- AI response quality monitoring
- Streaming generation/status updates
- Object storage for uploaded resumes
- Better observability and analytics

---

## Q98. How would you make the AI results more reliable?

**Answer:**

I would create an evaluation dataset containing:

- Resume
- Job description
- Expected relevant skills
- Expected interview topics
- Reference answers

Then I would evaluate generated reports against those references.

I could also:

- Use structured output
- Improve prompts
- Add retrieval of verified interview knowledge
- Add deterministic rule-based checks
- Run multiple-model verification for important outputs

---

# 23. ATS Questions

## Q99. What is ATS?

**Answer:**

ATS stands for **Applicant Tracking System**.

Companies can use ATS software to parse resumes and help filter or organize candidates.

An ATS-friendly resume should use clear text, standard sections and relevant job-specific terminology.

---

## Q100. How does your project use ATS concepts?

**Answer:**

The project asks Gemini to generate a tailored resume based on the job description and candidate information.

The prompt explicitly asks for ATS-friendly content and emphasizes relevant information.

The important point is that this is currently an **LLM-generated optimization**, not a fully deterministic ATS simulator.

---

# 24. Questions About AI Accuracy

## Q101. Can your match score be considered objectively accurate?

**Answer:**

Not automatically.

The score is generated by Gemini based on the provided profile and job description.

It should be treated as an AI-generated estimate rather than an objectively measured hiring probability.

To make it more reliable, I would define a scoring methodology and evaluate it against labeled examples.

---

## Q102. Can Gemini hallucinate?

**Answer:**

Yes.

An LLM can generate information that is plausible but unsupported by the input.

For this application, this is especially important because interview questions and skill-gap recommendations should be grounded in the candidate's actual profile and job description.

Possible improvements include stronger prompts, validation, retrieval-based grounding and output evaluation.

---

# 25. Project-Specific Keywords You Must Know

## Keyword Cheat Sheet

### MERN

**Meaning:** MongoDB, Express, React, Node.js.

**Use in project:** React frontend + Express/Node backend + MongoDB database.

---

### REST API

**Meaning:** HTTP-based API style using resources and HTTP methods.

**Use:** Authentication and interview-report operations.

---

### Middleware

**Meaning:** Function executed during the Express request-response cycle.

**Use:** Authentication and file upload.

---

### JWT

**Meaning:** JSON Web Token used to represent authenticated identity/claims.

**Use:** Protecting backend APIs.

---

### OAuth 2.0

**Meaning:** Authorization framework used by providers such as Google.

**Use:** Google sign-in flow.

---

### bcrypt

**Meaning:** Password hashing algorithm/library.

**Use:** Hashing passwords before storing them.

---

### Multer

**Meaning:** Express middleware for multipart/form-data uploads.

**Use:** Resume upload.

---

### pdf-parse

**Meaning:** Library used to extract text from PDF files.

**Use:** Convert uploaded resume PDF into text before sending it to Gemini.

---

### Gemini

**Meaning:** Google's generative AI model/API.

**Use:** Generate interview reports and tailored resume content.

---

### Prompt Engineering

**Meaning:** Designing effective instructions/input for an LLM.

**Use:** Tell Gemini what candidate data to analyze and what report to generate.

---

### Structured Output

**Meaning:** Asking the model to return data according to a defined schema.

**Use:** Match score, questions, skill gaps and roadmap.

---

### Zod

**Meaning:** JavaScript/TypeScript schema validation library.

**Use:** Define the expected Gemini response structure.

---

### JSON Schema

**Meaning:** Formal description of the structure and types of JSON data.

**Use:** Passed to Gemini as the expected response structure.

---

### Mongoose

**Meaning:** ODM for MongoDB.

**Use:** Define and interact with user/interview-report models.

---

### MongoDB ObjectId

**Meaning:** Identifier used for MongoDB documents.

**Use:** Identify users and reports and associate reports with users.

---

### CORS

**Meaning:** Cross-Origin Resource Sharing.

**Use:** Allow frontend and backend hosted on different origins to communicate.

---

### HTTP-only Cookie

**Meaning:** Cookie inaccessible to client-side JavaScript.

**Use:** Store authentication token.

---

### PDFKit

**Meaning:** Node.js library for programmatically generating PDFs.

**Use:** Generate the final tailored resume PDF.

---

### Axios

**Meaning:** HTTP client for JavaScript.

**Use:** Frontend API communication.

---

### Vite

**Meaning:** Modern frontend development/build tool.

**Use:** Run and build the React frontend.

---

# 26. Rapid-Fire Questions

## Q103. What is the frontend?

**Answer:** React + Vite.

## Q104. What is the backend?

**Answer:** Node.js + Express.js.

## Q105. What database?

**Answer:** MongoDB with Mongoose.

## Q106. What AI service?

**Answer:** Google Gemini through the Google GenAI SDK.

## Q107. What authentication?

**Answer:** JWT-based authentication plus Google sign-in.

## Q108. What handles file uploads?

**Answer:** Multer.

## Q109. What extracts PDF text?

**Answer:** pdf-parse.

## Q110. What generates resume PDFs?

**Answer:** PDFKit in the current implementation.

## Q111. Where is AI logic?

**Answer:** `Backend/src/services/ai.service.js`.

## Q112. Where is interview request handling?

**Answer:** `Backend/src/controllers/interview.controller.js`.

## Q113. Where is authentication middleware?

**Answer:** `Backend/src/middlewares/auth.middleware.js`.

## Q114. Where is the interview report model?

**Answer:** `Backend/src/models/interviewReport.model.js`.

## Q115. Where is the interview route?

**Answer:** `Backend/src/routes/interview.routes.js`.

## Q116. What does `req.user.id` represent?

**Answer:** The authenticated user's ID from the verified JWT.

## Q117. What does HTTP 429 mean?

**Answer:** Too many requests/rate limit exceeded.

## Q118. What is the maximum roadmap duration?

**Answer:** 48 months / 4 years.

## Q119. Maximum technical questions?

**Answer:** 50.

## Q120. Maximum behavioral questions?

**Answer:** 50.

---

# 27. "Explain This Project in 60 Seconds"

**Answer:**

AI-RESULYZER is a MERN-based AI interview-preparation platform.

A user provides a target job description and either uploads a resume or enters a self-description. The React frontend sends this data to my Node.js/Express backend.

The backend authenticates the user using JWT, processes the uploaded resume using Multer and PDF parsing, and sends the extracted profile plus job description to Google Gemini.

Gemini returns structured JSON containing a match score, technical questions, behavioral questions, skill gaps and a preparation roadmap. I use Zod to define the expected AI response structure.

The backend stores the report in MongoDB using Mongoose, and React displays the generated report.

I also implemented Google sign-in, report history, report deletion and tailored resume PDF generation using Gemini plus PDFKit.

---

# 28. "Explain the Most Important Code Flow"

**Answer:**

For interview-report generation:

```text
React
  ↓
POST /api/interview/
  ↓
authUser middleware
  ↓
Multer upload.single("resume")
  ↓
generateInterViewReportController()
  ↓
PDF text extraction
  ↓
validateGenerationPreferences()
  ↓
generateInterviewReport()
  ↓
Gemini
  ↓
Structured JSON
  ↓
JSON.parse()
  ↓
interviewReportModel.create()
  ↓
MongoDB
  ↓
201 JSON response
  ↓
React renders report
```

This is the flow I should be able to explain without looking at the code.

---

# 29. Interviewer Follow-Up Traps

## Q121. "Did you train Gemini?"

**Answer:**

No. I used Gemini as an external generative AI model through the Google GenAI API. My work was on integrating the model into the application, designing prompts and structured output, validating inputs, and building the surrounding system.

---

## Q122. "Did you build the LLM?"

**Answer:**

No. I built the application around the LLM. Gemini handles the language-generation part, while my application handles authentication, input processing, API orchestration, persistence and presentation.

---

## Q123. "Is your match score scientifically accurate?"

**Answer:**

No, I would not claim that without evaluation. It is an AI-generated score based on the provided resume/profile and job description. A stronger version would define an explicit scoring methodology and evaluate it against labeled examples.

---

## Q124. "Did you use Puppeteer?"

**Answer:**

The current code does not use Puppeteer in the active resume-PDF generation path. The current implementation uses PDFKit. The README mentions Puppeteer, but the implementation has since moved to PDFKit.

---

## Q125. "Can users upload DOCX?"

**Answer:**

The upload middleware accepts DOCX, but the current text-extraction implementation uses pdf-parse, so proper DOCX extraction is an improvement I would make next.

---

## Q126. "How do you know one user cannot access another user's report?"

**Answer:**

The backend does not only query by report ID. It also checks the authenticated user's ID:

`findOne({ _id: interviewId, user: req.user.id })`

Therefore the requested report must belong to the logged-in user.

---

# 30. Final Must-Memorize List

Before the interview, I should be able to explain these **without opening the code**:

1. **Project problem**
2. **Why I built it**
3. **Complete request flow**
4. **Why MERN**
5. **Why MongoDB**
6. **Why Express/Node**
7. **Why React**
8. **Why Gemini**
9. **Why not train an LLM**
10. **How Gemini receives the data**
11. **Why structured JSON**
12. **What Zod does**
13. **What zodToJsonSchema does**
14. **How resume upload works**
15. **What Multer does**
16. **How PDF text is extracted**
17. **How authentication works**
18. **How JWT works**
19. **How Google login works**
20. **Why Google token → own JWT**
21. **How logout works**
22. **Why token blacklist exists**
23. **How reports are stored**
24. **How user/report ownership is enforced**
25. **How resume PDF generation works**
26. **PDFKit vs Puppeteer**
27. **Challenges**
28. **Current limitations**
29. **How to scale**
30. **How to reduce AI cost**
31. **How to improve AI reliability**
32. **How to handle rate limits**
33. **Important HTTP status codes**
34. **Important security improvements**
35. **60-second project explanation**

---

# 31. Golden Rule for the Interview

When answering project questions:

**Do not say:**
> "I used X because it is the best technology."

Instead say:
> "I chose X because this project had requirement Y, and X solved that requirement in this way. Another technology could also work, but X kept the implementation simpler for my use case."

This makes the answer sound like an engineering decision rather than a memorized technology list.

Also, never invent:
- Performance numbers
- User counts
- Accuracy percentages
- Production traffic
- Challenges you did not actually face
- Technologies not present in the current implementation

If asked about something that is not implemented, say:

> "That is not implemented in the current version. My approach for adding it would be..."

That is a much safer interview answer than pretending it exists.
