# ContigoVoy 🧠💙

A modern online psychological therapy platform built with Next.js 15, connecting patients with licensed psychologists for convenient and accessible mental health care.

## 🌟 Features

### For Patients
- **Online Therapy Sessions** – Schedule and attend therapy sessions from anywhere  
- **Appointment Management** – Easy booking, rescheduling, and cancellation  
- **Psychologist Profiles** – Browse and select from qualified professionals  
- **Patient Dashboard** – Track therapy progress and session history  
- **Secure Communication** – Private messaging with therapists  
- **Family Registration** – Add family members to your account  

### For Psychologists
- **Professional Dashboard** – Manage appointments, patients, and schedules  
- **Calendar Integration** – View and organize therapy sessions  
- **Patient Management** – Access patient records and history  
- **Statistics & Analytics** – Track performance and client metrics  
- **Marketing Tools** – Promote services and specializations  

### Platform Features
- **Responsive Design** – Works seamlessly on desktop, tablet, and mobile  
- **Dark/Light Theme** – Customizable user interface  
- **Blog System** – Mental health articles and resources  
- **FAQ Section** – Common questions and answers  
- **Contact & Support** – Multiple ways to get help  

## 🚀 Tech Stack

- **Framework**: Next.js 15.2.4 with Turbopack  
- **Frontend**: React 19, TypeScript  
- **Styling**: Tailwind CSS, FlyOnUI  
- **UI Components**: Radix UI, HeroUI  
- **Forms**: React Hook Form with Zod validation  
- **Rich Text Editor**: Tiptap  
- **Calendar**: React Big Calendar  
- **Charts**: Recharts  
- **Authentication**: JWT tokens  
- **Email**: Nodemailer  
- **Animations**: Framer Motion  
- **Icons**: Lucide React, React Icons  

## 📁 Project Structure

```text
ContigoVoy3/
├── app/                    # Next.js App Router
│   ├── blog/              # Blog pages
│   ├── contactanos/       # Contact us page
│   ├── login/             # Authentication
│   ├── servicios/         # Services page
│   ├── user/              # User dashboard
│   │   ├── calendario/    # Calendar management
│   │   ├── citas/         # Appointments
│   │   ├── estadisticas/  # Statistics
│   │   ├── pacientes/     # Patient management
│   │   └── psicologos/    # Psychologist profiles
│   └── ReservarCita/      # Appointment booking
├── components/            # Reusable React components
│   ├── ui/                # UI components
│   ├── auth/              # Authentication components
│   ├── User/              # User-specific components
│   └── stadistic/         # Statistics components
├── lib/                   # Utility libraries
├── utils/                 # Helper functions
└── public/                # Static assets
````

## 🛠️ Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/contigovoy3.git
cd contigovoy3

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Then edit `.env.local` to add your own configuration

# 4. Run the development server
npm run dev

# 5. Open your browser
# Visit: http://localhost:3000
```

## 📋 Available Scripts

```bash
npm run dev       # Start development server with Turbopack
npm run build     # Build the application for production
npm run start     # Start the production server
npm run lint      # Run ESLint for code quality
npm run export    # Export static files
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following:

```env
# Database
DATABASE_URL=your_database_url

# Authentication
JWT_SECRET=your_jwt_secret

# Email Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# Other configurations
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🎨 Styling

The project uses Tailwind CSS with custom configurations:

* **FlyOnUI** – Component library for consistent design
* **Tailwind Animations** – Smooth transitions and effects
* **Dark/Light Theme** – Automatic theme switching
* **Responsive Design** – Mobile-first approach

## 📱 Features Overview

### Authentication & Authorization

* Secure login/logout system
* Role-based access control (patients/psychologists)
* JWT token management

### Appointment System

* Real-time calendar integration
* Appointment scheduling and management
* Email notifications

### User Management

* Patient profiles and medical history
* Psychologist credentials and specializations
* Family member registration

### Communication

* Secure messaging system
* Session notes and records
* Email integration

## 🔒 Security

* JWT-based authentication
* Input validation with Zod
* Secure API routes
* Environment variable protection
* HTTPS enforcement in production

## 📊 Analytics & Reporting

* Session statistics
* Patient progress tracking
* Appointment analytics
* Performance metrics

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm run build
# Then deploy using Vercel dashboard or CLI
```

### Other Platforms

You can deploy to any platform that supports Next.js, including:

* Netlify
* AWS
* DigitalOcean
* Railway

## 🤝 Contributing

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/my-feature

# 3. Commit your changes
git commit -m "Add feature"

# 4. Push to your branch
git push origin feature/my-feature

# 5. Open a pull request on GitHub
```

## 📞 Support

* Email: [support@contigovoy.com](mailto:support@contigovoy.com)
* Website: [https://contigovoy.com](https://contigovoy.com)
* Docs: [https://docs.contigovoy.com](https://docs.contigovoy.com)

## 🙏 Acknowledgments

* Next.js team for the amazing framework
* Vercel for hosting and deployment
* All contributors and mental health professionals who made this possible

---

**ContigoVoy** – Connecting you with mental wellness, one session at a time. 🧠💙