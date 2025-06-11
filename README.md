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
## Dependenicies to Install and Run

Backend : Navigate to the backend directory
```plaintext
npm install
node index.js
```




