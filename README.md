#  FinAgent - AI-Powered Portfolio Assistant

**FinAgent** is an intelligent stock portfolio assistant that helps users manage and analyze their stock holdings.  
It integrates an LLM agent with portfolio tools, chat history, and a clean React UI.

---

## Features

-Interactive chat assistant powered by LangChain + GPT-4o  
-Load your current portfolio and view stock data  
-Analyze portfolio diversification by sector  
-Get stock recommendations based on your portfolio  
-Chat history persisted in Supabase  
-User authentication (Supabase Auth)  
-Full CRUD on stock portfolio  

---

## Tech Stack

- **Frontend:** React + CSS Modules
- **Backend:** Node.js + Express + LangChain Agent
- **Database:** Supabase (Postgres + Auth + Storage)
- **LLM:** OpenAI GPT-4o via LangChain
- **External Data:** Using Polygon's stock API to obtain real time stock data

---

## Project Structure

```plaintext
/frontend
  ├── components
  │    ├── PortfolioCarousel.jsx
  │    ├── PortfolioCard.jsx
  │    ├── FinAgentChat.jsx
  │    ├── FinAgentActionProvider.jsx
  │    ├── FinAgentMessageParser.jsx
  ├── pages
  │    ├── Auth.jsx
  ├── App.jsx
  ├── App.css

/backend
  ├── index.js
  ├── agent
  │    ├── portfolioAgent.js
  │    ├── tools
  │    │    ├── loadPortfolioTool.js
  │    │    ├── analyzePortfolioDiversificationTool.js
  │    │    ├── recommendStocksTool.js
  ├── helpers
  │    ├── loadPortfolioHelper.js
  ├── lib
  │    ├── supabaseClient.js

/supabase
  ├── chat_history table (user_id, role, content, created_at)
  ├── portfolio table
```

---

## Dependenicies to Install and Run

Backend : Navigate to the backend directory, will run on port 5001
```plaintext
cd backend
npm install
node index.js
```
Frontend : Navigate to the frontend directory, will run on port 5173
```plaintext
cd frontend
npm install
npm run dev
```
---

## Supabase Setup
Create a Supabase Project
Create the following tables : portfolios and chat_history

Schema of portfolios :

| Column        | Type       | Description                            |
|---------------|------------|----------------------------------------|
| id            | uuid       | Primary Key (auto-generated)           |
| user_id       | uuid       | Foreign key referencing auth.users.id  |
| company_name  | text       | Full name of the company               |
| ticker        | text       | Stock ticker symbol (e.g. AAPL)        |
| bought_at     | timestampz | Date when the stock was purchased      |
| value         | numeric    | Price bought at per share              |
| created_at    | timestampz | Timestamp when this record was created |
| quantity      | numeric    | Number of shares purchased             |
| current_price | numeric    | Current market price of the stock      |


Schema of chat_history : 

| Column        | Type       | Description                            |
|---------------|------------|----------------------------------------|
| id            | uuid       | Primary Key (auto-generated)           |
| user_id       | uuid       | Foreign key referencing auth.users.id  |
| message_index | int4       | Message index in order                 |
| role          | text       | User or assistant                      |
| content       | text       | Content of the message                 |
| created_at    | timestampz | Timestamp when this record was created |

