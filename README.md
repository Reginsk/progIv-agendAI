# emprestAI - Lending Management System

**emprestAI** is a lending management platform designed to streamline the process of borrowing and returning items in organizations, schools, or any environment that requires efficient asset tracking.

## 📋 Overview

This application allows users to:
- **Manage Items**: Add, edit, and track inventory items available for lending
- **User Management**: Handle user accounts and permissions
- **Borrow Tracking**: Create, manage, and monitor lending records
- **Calendar Integration**: Visual calendar interface showing due dates and return schedules

## 🏗️ Project Structure

```
emprestAI/
├── backend/          # Node.js + TypeScript API server
├── frontend/         # Next.js + React web application
└── README.md         # This file
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT-based authentication
- **API Documentation**: RESTful endpoints

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: Material-UI (MUI)
- **Language**: TypeScript
- **State Management**: SWR for data fetching
- **Forms**: React Hook Form + Yup validation
- **Calendar**: FullCalendar integration
- **Date Handling**: MUI X Date Pickers
- **Styling**: Material-UI components + Custom themes

## 🚀 Key Features

### 📦 Item Management
- Complete CRUD operations for inventory items
- Category organization
- Quantity tracking (total vs. available)

### 👥 User Management
- User registration and authentication
- Role-based access control (Admin/User)
- Profile management

### 📅 Borrow System
- Create lending records with due dates
- Track borrow status (Active, Returned, Overdue)
- Calendar visualization of due dates

### 🗓️ Calendar Integration
- Visual calendar showing all due dates
- Color-coded events by status:
  - 🔵 **Blue**: Active borrows
  - 🟢 **Green**: Returned items
  - 🔴 **Red**: Overdue items
- Click-to-edit functionality
- Form-based borrow creation and editing

## 🔧 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database
- Docker

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Reginsk/progIv-agendAI
   ```

2. **Backend Setup**
   ```bash
   cd backend
   # Follow instructions in backend/README.md
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   # Follow instructions in frontend/README.md
   ```

## 📖 Detailed Setup Instructions

For detailed installation, configuration, and deployment instructions, please refer to:

- **Backend**: [`backend/README.md`](./backend/README.md)
  - Database setup and migrations
  - Environment configuration
  - API endpoints documentation

- **Frontend**: [`frontend/README.md`](./frontend/README.md)
  - Development server setup
  - Environment variables
  - Build and deployment
  - UI components structure

## 🌟 Core Workflow

1. **Admin Setup**: Configure users and add items to inventory
2. **Create Borrows**: Users or admins create borrowing records through the calendar interface
3. **Track Returns**: Monitor due dates and mark items as returned
4. **Visual Management**: Use the calendar view to see all pending returns and overdue items

## 🎯 Use Cases

- **Educational Institutions**: Lab equipment, books, and learning materials
- **Corporate Environments**: Tools, devices, and shared resources
- **Libraries**: Books, multimedia, and study materials
- **Maker Spaces**: Tools, equipment, and project materials
- **Sports Clubs**: Equipment and gear management
