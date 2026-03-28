🛒 MicroMart Web: High-Performance E-Commerce Interface

MicroMart Web is the premium frontend consumer for the MicroMart Microservices ecosystem. It is a sophisticated Single Page Application (SPA) designed with a focus on Visual Depth, Role-Based Routing, and Admin Orchestration. Featuring a custom "Liquid" theme engine and a full suite of administrative tools, it provides a high-fidelity experience for both customers and platform operators.

✨ Key Technical Features

🎨 Dual-Aesthetic Theme Engine: Implements a context-aware UI with multiple "Liquid Background" states (Dark, Deep, Vibrant) providing an immersive, high-end visual identity.

🔐 Advanced Auth Orchestration: Full lifecycle management including Email Verification, Password Recovery, and Session Timeout handling.

🖥️ Admin Command Center: Dedicated dashboards for Product management, Inventory registries, and User auditing, separated by specialized Layout wrappers.

📦 Optimized Inventory Registry: Professional-grade tables with skeletons and real-time stock status monitoring.

💳 Polymorphic Payment UI: Integrated Stripe modal flow with specialized Success/Cancel routing and receipt handling.

🏗️ Architecture & Patterns

Component Organization

The project follows a modular "Pages & Views" architecture, ensuring that business logic is decoupled from presentational components.

graph TD
    %% Global Styles
    classDef layout fill:#198754,color:#fff,stroke:#146c43,stroke-width:2px;
    classDef page fill:#0d6efd,color:#fff,stroke:#0a58ca,stroke-width:2px;
    classDef context fill:#6f42c1,color:#fff,stroke:#59339d,stroke-width:2px;

    App[App.js / Router] --> Contexts[Context Providers]
    Contexts --> ThemeCtx[ThemeContext]
    Contexts --> ToastCtx[ToastContext]
    class ThemeCtx,ToastCtx context

    App --> Layouts{Layout Switcher}
    Layouts --> AdminL[AdminLayout]
    Layouts --> UserL[UserLayout]
    Layouts --> AccountL[AccountLayout]
    class AdminL,UserL,AccountL layout

    AdminL --> AdminPages[Inventory / UserList / AddProduct]
    UserL --> DashboardPages[ProductGallery / Details / Orders]
    AccountL --> AccountPages[Vouchers / ProfileSettings]
    class AdminPages,DashboardPages,AccountPages page


Engineering Design Patterns

Layout Pattern: Utilizes high-level layout components to provide consistent shells (Sidebars, Navs) for different user segments.

Custom Hook Pattern: Decouples session logic (e.g., useSessionTimeout) from the UI layer.

Context API: Manages global "Theming" and "Toasting" without the overhead of heavy state-management libraries.

Service Layer Pattern: Centralizes all asynchronous communication in services/api.js for easier environment switching.

📂 Project Structure

src/
├── components/      # UI Elements (PaymentModal, CartDrawer, LiquidBackgrounds)
├── contexts/        # Global state (Theme, Toasts)
├── data/            # Static datasets (Countries list, etc.)
├── hooks/           # Reusable logic (useSessionTimeout)
├── layouts/         # Layout Wrappers (Admin, User, Account)
├── pages/           # High-level Views
│   ├── admin/       # Inventory, Dashboards, and Management
│   ├── Auth/        # Login, Signup, Reset Password, Verification
│   ├── Dashboard/   # Product Gallery, Orders, Tracking
│   └── Payment/     # Success and Cancellation states
├── services/        # Centralized API (Axios) configuration
└── views/           # Marketing/Specialty views (Offers)


🚀 Local Development Setup

1. Environment Configuration

Create a .env file in the root directory:

VITE_API_GATEWAY_URL=http://localhost:7082
VITE_STRIPE_KEY=your_stripe_public_key


2. Installation & Execution

# Install dependencies
npm install

# Start the development server
npm run dev


3. Build for Production

npm run build


🎨 Visual System

The UI utilizes Tailwind CSS for a utility-first design approach, combined with custom CSS modules for high-fidelity animations like the Snowfall and LiquidBackground components, ensuring a "Premium" feel across all device sizes.