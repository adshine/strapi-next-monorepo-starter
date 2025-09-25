# Chicly Product and Feature Library

This document contains a comprehensive overview of the Chicly mobile application, including its structure, user flows, and detailed product requirement documents (PRDs) for various features.

---

## Mobile App Structure

### ChiclyApp mobile/

├── **Onboarding (First-time user flow)**
│ ├── 1. Welcome Screens (App value proposition)
│ ├── 2. Authentication (Screen)
│ │ ├── Sign Up (Flow)
│ │ │ ├── Enter Email / Phone
│ │ │ ├── OTP Verification
│ │ │ └── Create Password & Profile (Name, etc.)
│ │ ├── Login (Flow)
│ │ │ ├── Enter Email / Phone & Password
│ │ │ └── Forgot Password
│ │ └── Social Login (Google, Facebook)
│ └── 3. Initial Profile Setup (Buyer profile basics)
│
└── **MainApp (Authenticated user experience)**
│
├── **Tab 1: Home (Community Feed)**
│ ├── Stories Bar (Vendor/Creator updates)
│ ├── Main Feed (Infinite scroll of Community Posts)
│ │ └── Post (Card Component)
│ │ ├── View Post Details (Screen)
│ │ ├── Like / Comment / Save / Share
│ │ ├── View Vendor Profile
│ │ └── View Tagged Product -> Product Detail Screen
│ └── Create Post (+) (Floating Action Button for Vendors/Creators)
│
├── **Tab 2: Discover**
│ ├── Search Bar (Triggers Search Flow)
│ │ └── Search Results (Screen)
│ │ └── Filters (Price, Vendor Tier ✅🥇👑, Rating, etc.)
│ ├── Browse by Categories
│ └── Trending Products & Vendors
│
├── **Tab 3: Hype Boost (Influencer Marketplace)**
│ ├── For Creators/Influencers:
│ │ ├── Campaign Feed (List of available campaigns)
│ │ ├── View Campaign Details (Screen)
│ │ │ └── Apply to Campaign (Flow)
│ │ ├── My Applications (Track status)
│ │ └── My Active Gigs (Submit content, track approval)
│ └── For Vendors:
│ ├── My Campaigns Dashboard
│ ├── Create New Campaign (Flow)
│ └── Browse Creators (Find influencers to invite)
│
├── **Tab 4: Messages**
│ ├── Conversations List (Screen)
│ └── Conversation View (Screen)
│ ├── Text, Image, Voice Messages
│ ├── Product Card (Shared item)
│ └── Order Update (System message)
│
└── **Tab 5: Profile**
├── Profile Header (Avatar, Name, Edit Profile)
├── My Orders (Buyer View)
│ ├── Order History (List)
│ └── Order Details (Screen)
│ ├── Track Status
│ ├── Leave a Review (Flow)
│ └── File a Dispute (Flow)
├── Saved Items (Collections)
├── Settings
│ ├── Account Management
│ ├── Notification Settings
│ └── Security & Privacy
├── Upgrade Account (Flow)
│ ├── Become a Vendor (Triggers Vendor Onboarding)
│ └── Become a Creator (Triggers Influencer Onboarding)
└── Role-Specific Dashboards (Conditional View)
├── Vendor Dashboard (If user is a vendor)
│ ├── Analytics Overview
│ ├── My Products
│ │ ├── Product List
│ │ └── Add/Edit Product (Flow)
│ ├── Manage Orders
│ ├── My Reviews
│ └── Accreditation Badge Status (Track progress to next tier)
└── Creator Dashboard (If user is an influencer)
├── My Portfolio
├── Earnings & Payouts
└── Campaign History

**Global Components & Flows (Accessible from multiple points):**

├── **Product Detail (Screen)**
│ ├── Image/Video Carousel
│ ├── Product Info (Description, Price)
│ ├── Vendor Info (Name, Badge ✅🥇👑)
│ │ └── View Vendor Profile (Screen)
│ ├── Actions
│ │ ├── Save to Collection
│ │ ├── Start In-App Chat
│ │ └── Contact on WhatsApp (Exits to WhatsApp)
│ └── Reviews Section
└── **Vendor Profile (Screen)**
├── Vendor Details (Bio, Badge, Stats)
├── Product Catalog (Grid/List)
└── Reviews

---

## User Flow

**Chicly Mobile App: Detailed Information Architecture & Interaction Flow**
This table breaks down each user flow into its constituent screens and components. It is designed to be a single source of truth for designers creating wireframes and developers building the application structure.

| Role                   | Name / Team             |
| :--------------------- | :---------------------- |
| **Product Manager**    | Fadeke Toba             |
| **Engineering Lead**   | Princewill              |
| **Designer**           | Adebimpe, Kevwe, Busayo |
| **Approvers/Sign-Off** | Adebimpe, Product Owner |
| **Status of PRD:**     | **Backlog**             |

| Flow / Action                     | Preceding Context                                          | Est. Screen Count | Key Screens, Components & States                                                                                                                                                                                                                                                                                                                                                               | Core Information Displayed                                            | Primary CTAs                                                                              |
| :-------------------------------- | :--------------------------------------------------------- | :---------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| **Onboarding**                    |                                                            |                   |                                                                                                                                                                                                                                                                                                                                                                                                |                                                                       |                                                                                           |
| Swipe through Welcome Screens     | The user opens the app for the first time.                 | 3                 | Screen 1, 2, 3: Welcome Carousel`<br>`- Full-screen graphic/animation`<br>`- Value proposition text (e.g., "Shop Safely," "Discover Creators")`<br>`- Page indicator dots (e.g., 1 of 3)                                                                                                                                                                                                       | Brand slogan, core benefits of using Chicly.                          | Next, Get Started                                                                         |
| Tap 'Sign up with Email/Phone'    | The user is on the main Authentication screen.             | 1                 | Screen: Create Account`<br>`- Header text: "Create Account"`<br>`- Input Fields: Display Name, Email/Phone, Password`<br>`- Checkbox with link to Terms & Privacy Policy                                                                                                                                                                                                                       | Placeholder text, password requirements.                              | Sign up with Email, Continue with Apple/Google/Microsoft, Already have an account? Log in |
| Enter sign-up details             | The user is on the "Create Account" form.                  | 3                 | Screen 1: Create Account Form (as above)`<br>`**Screen 2: OTP Verification Screen**`<br>`- Header: "Verify Your Email/Phone"`<br>`- Instruction text`<br>`- OTP input boxes (e.g., 6 digits)`<br>`- Resend code link with timer`<br>`**Screen 3: Basic Profile Setup**`<br>`- Header: "Welcome! Let's get set up"`<br>`- Avatar upload component`<br>`- Optional input fields (e.g., Location) | User's email/phone, countdown timer.                                  | Verify, Resend Code, Finish, Skip for now                                                 |
| Tap 'Log In'                      | The user is on the Authentication screen.                  | 1                 | Screen: Log In`<br>`- Header text: "Welcome Back"`<br>`- Input Fields: Email/Phone, Password`<br>`- Link: "Forgot Password?"                                                                                                                                                                                                                                                                   | Placeholder text.                                                     | Log in, Continue with Apple/Google/Microsoft, Don't have an account? Sign up              |
| Tap 'Forgot Password'             | The user is on the Login screen.                           | 3                 | Screen 1: Request Reset`<br>`- Input Field: Email/Phone`<br>`**Screen 2: Confirmation Message**`<br>`- Text: "Check your email for a reset link."`<br>`**Screen 3: Reset Password Screen** (from email link)`<br>`- Input Fields: New Password, Confirm New Password                                                                                                                           | Instruction text, success/confirmation messages.                      | Send Reset Link, Reset Password                                                           |
| **Home (Community Feed)**         |                                                            |                   |                                                                                                                                                                                                                                                                                                                                                                                                |                                                                       |                                                                                           |
| View the main feed                | The user has logged in and is on the Home tab.             | 1                 | Screen: Home`<br>`- Component: Horizontal Stories Bar (top)`<br>`- Component: Vertical, infinite-scroll feed of Post Cards                                                                                                                                                                                                                                                                     | Vendor/Creator avatars, list of posts.                                | + Create Post (Floating Action Button for vendors/creators)                               |
| Interact with a Post Card         | The user is scrolling the feed.                            | 0-1               | Component: Post Card`<br>`- Vendor Avatar, Name, Verification Badge (✅🥇👑)`<br>`- Product Image(s) (swipeable carousel)`<br>`- Product Title & Price`<br>`- Post caption (truncated)`<br>`- Interaction Icons: Like, Comment, Save                                                                                                                                                           | Vendor info, product details, engagement counts (likes, comments).    | Tapping post opens Post Detail Screen. Tapping icons performs action.                     |
| Create a new post                 | A Vendor/Creator taps the floating '+' button.             | 1                 | Screen: New Post`<br>`- Image/Video uploader`<br>`- Text Area: Caption`<br>`- Feature: Tag a Product (opens product picker)`<br>`- Feature: Tag other Users                                                                                                                                                                                                                                    | Selected media, character count.                                      | Share, Cancel                                                                             |
| **Discover**                      |                                                            |                   |                                                                                                                                                                                                                                                                                                                                                                                                |                                                                       |                                                                                           |
| Initiate a search                 | The user navigates to the Discover tab.                    | 1                 | Screen: Discover / Search`<br>`- Search Bar (top)`<br>`- Component: Category buttons/grid`<br>`- Component: "Trending Now" product grid                                                                                                                                                                                                                                                        | Category names (Fashion, Beauty), trending product images and prices. | Tapping the search bar focuses input and shows recent searches.                           |
| Apply a search filter             | The user is on the search results screen.                  | 1                 | Modal / Bottom Sheet: Filters`<br>`- Component: Price Range Slider`<br>`- Component: Checkbox list for Vendor Tiers (✅, 🥇, 👑)`<br>`- Component: Radio button list for "Sort By" (Relevance, Newest, Price)                                                                                                                                                                                  | Current filter settings.                                              | Apply Filters, Reset, Close                                                               |
| **Hype Boost**                    |                                                            |                   |                                                                                                                                                                                                                                                                                                                                                                                                |                                                                       |                                                                                           |
| (Creator) Apply to a campaign     | Creator views a campaign's details.                        | 2                 | Screen 1: Campaign Details`<br>`- Header: Campaign Name, Vendor Info`<br>`- Sections: Description, Requirements, Budget`<br>`**Screen 2: Application Form (Modal)**`<br>`- Input Field: Proposed Rate`<br>`- Text Area: Message to Vendor                                                                                                                                                      | Campaign goals, content type needed, follower requirements.           | Apply Now, Submit Application                                                             |
| **Profile**                       |                                                            |                   |                                                                                                                                                                                                                                                                                                                                                                                                |                                                                       |                                                                                           |
| View Profile                      | The user navigates to the Profile tab.                     | 1                 | Screen: My Profile`<br>`- Component: Profile Header (Avatar, Name, Handle)`<br>`- Menu List Items: My Orders, Saved Items, Settings`<br>`- Component: "Upgrade Account" Banner (if buyer)                                                                                                                                                                                                      | User's own profile information.                                       | Edit Profile, Tappable menu items.                                                        |
| Upgrade account to Vendor/Creator | Users tap the "Upgrade" banner on their profile.           | 2-3               | Screen 1: Info Screen (explains benefits)`<br>`**Screen 2: Verification Form**`<br>`- Input fields for Business Name, CAC, etc. (Vendor)`<br>`- Social account linking (Creator)`<br>`**Screen 3: Confirmation/Pending Review**                                                                                                                                                                | Requirements for the new role.                                        | Upgrade Now, Submit for Review                                                            |
| **Vendor-Specific Actions**       |                                                            |                   |                                                                                                                                                                                                                                                                                                                                                                                                |                                                                       |                                                                                           |
| View Vendor Dashboard             | A Vendor navigates to their Profile tab.                   | 1                 | Screen: Vendor Dashboard (replaces buyer profile view)`<br>`- Component: Analytics Overview Card (Key stats)`<br>`- Component: Accreditation Badge Status (shows current tier and progress to next)`<br>`- Menu List Items: My Products, Manage Orders, My Reviews                                                                                                                             | Total views, orders, revenue, current badge.                          | Tappable menu items.                                                                      |
| Add a new product                 | Vendor is on their "My Products" screen.                   | 1                 | Screen: Add/Edit Product`<br>`- Component: Image/Video Uploader`<br>`- Input Fields: Title, Description, Price, Quantity`<br>`- Dropdown/Selector: Category, Sub-category`<br>`- Component: Variants (Size, Color)                                                                                                                                                                             | Product information being entered.                                    | Save Product, Save as Draft                                                               |
| **Global Actions**                |                                                            |                   |                                                                                                                                                                                                                                                                                                                                                                                                |                                                                       |                                                                                           |
| View Product Details              | The user taps on any product from a feed or search result. | 1                 | Screen: Product Detail`<br>`- Image/Video Carousel (top)`<br>`- Section: Product Info (Title, Price, Description)`<br>`- Section: Vendor Info (Name, Avatar, Badge ✅🥇👑)`<br>`- Section: Reviews Summary                                                                                                                                                                                     | Full product details, vendor rating, number of reviews.               | Contact on WhatsApp, Start In-App Chat, Save to Collection                                |
| View Saved Items (Collections)    | Users navigate from their Profile.                         | 1                 | Screen: Collections / Saved Items`<br>`- Tabbed Interface (e.g., All, My Collections)`<br>`- Grid of saved products (as Product Cards)                                                                                                                                                                                                                                                         | All products the user has bookmarked.                                 | + Create New Collection                                                                   |

---

## Interactions

**Chicly Mobile App: User Interaction Flow**

| Role                   | Name / Team             |
| :--------------------- | :---------------------- |
| **Product Manager**    | Fadeke Toba             |
| **Engineering Lead**   | Princewill              |
| **Designer**           | Adebimpe, Kevwe, Busayo |
| **Approvers/Sign-Off** | Adebimpe, Product Owner |
| **Status of PRD:**     | **Backlog**             |

| Flow Tree Item / Action                             | Preceding Steps / Context                                                                                                                            |
| :-------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Onboarding**                                      |                                                                                                                                                      |
| Swipe through Welcome Screens                       | User opens the Chicly app for the very first time.                                                                                                   |
| Tap 'Sign up with Email/Phone'                      | User is on the main Authentication screen after the welcome flow.                                                                                    |
| Enter sign-up details (Name, Email/Phone, Password) | User has tapped "Sign up" and is now presented with the "Create Account" form.                                                                       |
| Tap "Continue with Google"                          | User is on the main Authentication screen and chooses the social login option.                                                                       |
| Enter OTP Code                                      | User has submitted their phone/email for sign-up and is now on the verification screen.                                                              |
| Tap 'Log In'                                        | User is on the Authentication screen and taps the "Already have an account? Log in" link.                                                            |
| Tap 'Forgot Password'                               | User is on the Login screen after failing to enter the correct password or tapping the link.                                                         |
| Allow/Deny Push Notifications                       | After successfully signing up or logging in for the first time, a system permission modal appears.                                                   |
| Allow/Deny Password Saving                          | After a successful login, the phone's operating system prompts to save the password to the keychain.                                                 |
| **Home (Community Feed)**                           |                                                                                                                                                      |
| Scroll the main feed                                | User has logged in and is on the default Home tab.                                                                                                   |
| Tap to view Stories                                 | User is on the Home tab and taps a vendor/creator's icon in the horizontal Stories Bar at the top.                                                   |
| Like a post                                         | User is scrolling the feed and taps the heart icon on a specific post card.                                                                          |
| Comment on a post                                   | User taps the comment icon on a post, which navigates to the post's detail view with the keyboard open.                                              |
| Save a post/product to a Collection                 | User taps the bookmark/save icon on a post card in the feed.                                                                                         |
| View a Vendor's Profile                             | User taps the vendor's name or profile picture on a post card in the feed.                                                                           |
| View a tagged Product's Details                     | User taps on a product that is tagged within a community post.                                                                                       |
| Create a new post                                   | A user with Vendor or Creator status taps the floating '+ Create Post' button on the Home screen.                                                    |
| **Discover**                                        |                                                                                                                                                      |
| Initiate a search                                   | User navigates to the Discover tab and taps inside the Search Bar at the top of the screen.                                                          |
| Apply a search filter                               | After performing a search, the user is on the results screen and taps a 'Filter' button to open filter options (e.g., by Vendor Tier, Price).        |
| Browse a specific category                          | User is on the Discover tab and taps on a category button or image (e.g., "Fashion," "Beauty," "Lifestyle").                                         |
| **Hype Boost (Influencer Marketplace)**             |                                                                                                                                                      |
| (Creator) Apply to a campaign                       | A Creator is on the Hype Boost tab, taps on a campaign to view its details, and then taps the "Apply" button.                                        |
| (Vendor) Create a new campaign                      | A Vendor navigates to the Hype Boost tab, accesses their dashboard, and taps the "Create New Campaign" button.                                       |
| (Vendor) Browse Creators                            | A Vendor is on the Hype Boost tab and selects the option to discover or search for creators to invite to a campaign.                                 |
| **Messages**                                        |                                                                                                                                                      |
| Open a conversation                                 | User navigates to the Messages tab and taps on a specific conversation from the list.                                                                |
| Send a message                                      | Inside a conversation view, the user types into the text input field at the bottom and taps the "Send" button.                                       |
| **Profile**                                         |                                                                                                                                                      |
| Edit profile details                                | User navigates to the Profile tab and taps the "Edit Profile" button.                                                                                |
| View Order History                                  | User is on the Profile tab and taps on the "My Orders" menu item.                                                                                    |
| Leave a review for an order                         | User has navigated to "My Orders," tapped on a completed order, and then taps the "Leave a Review" button.                                           |
| File a dispute for an order                         | User is viewing the details of an active or recent order in "My Orders" and taps "File a Dispute."                                                   |
| View Saved Items (Collections)                      | User navigates to the Profile tab and taps on "Saved Items" or "Collections."                                                                        |
| Upgrade account to Vendor/Creator                   | User is on their buyer Profile screen and taps the "Become a Vendor" or "Become a Creator" call-to-action.                                           |
| **Vendor-Specific Actions**                         |                                                                                                                                                      |
| Add a new product                                   | A Vendor has navigated to their Profile tab, selected their "Vendor Dashboard," tapped on "My Products," and then taps the "Add New Product" button. |
| View vendor analytics                               | A Vendor is on their "Vendor Dashboard" and taps on the "Analytics" section.                                                                         |
| Check Accreditation Badge status                    | A Vendor is on their "Vendor Dashboard" and views the section dedicated to their badge tier and progress.                                            |
| **Global Actions (Across Multiple Screens)**        |                                                                                                                                                      |
| Contact a Vendor on WhatsApp                        | From a Product Detail screen, the user taps the "Contact on WhatsApp" button, which triggers the app to open WhatsApp.                               |
| Save a Product to a Collection                      | From a Product Detail screen, the user taps the save/bookmark icon.                                                                                  |

---

## User Onboarding & Authentication

| Role                   | Name / Team             |
| :--------------------- | :---------------------- |
| **Product Manager**    | Fadeke Toba             |
| **Engineering Lead**   | Princewill              |
| **Designer**           | Adebimpe, Kevwe, Busayo |
| **Approvers/Sign-Off** | Adebimpe, Product Owner |
| **Status of PRD:**     | **Backlog**             |

**Overview**
This feature enables Chicly users (buyers, vendors, creators) to securely sign up, log in, and manage accounts, while allowing guest users to view posts and products without logging in. Engagement actions are restricted for guests. Onboarding is lightweight, mobile-friendly, and encourages smooth entry into Chicly. Expired product listings/posts are automatically removed after a configured timeout.

**Problem**
Instagram buyers, vendors, and creators currently lack a centralized, trusted entry point into a marketplace. Complex or forced onboarding discourages adoption. Chicly needs a simple, flexible onboarding that reduces barriers, supports growth, and builds trust while maintaining product freshness through automatic expiration.

**Objectives**

1. Allow anyone to view posts and products without logging in, while restricting engagement actions.
2. Enable users to sign up/login securely using phone number, email, or Google with minimal friction.
3. Support account upgrades (Buyer → Vendor → Creator) via profile, not at initial onboarding.
4. Ensure fast and reliable password reset.
5. Ensure product listing expiration rules are applied to guest-visible posts.

**Constraints**

1. Launch deadline: December 20, 2025 (Beta).
2. OTP/email/Google verification service reliability in Nigeria is critical.
3. Advanced login features (Facebook, Apple ID, biometrics) excluded from MVP.

**Persona**

| Key Persona                             | Description                                                                                     |
| :-------------------------------------- | :---------------------------------------------------------------------------------------------- |
| **Mid-income female buyer (22–30 yrs)** | Wants to quickly browse and view products without hurdles; may sign up later.                   |
| **Small business vendor (25–35 yrs)**   | Signs up normally, later upgrades to vendors via profile to start selling.                      |
| **Creator (18–35 yrs)**                 | Registers as a regular user, later upgrades to “Creator” to showcase content or collaborations. |

**Use Cases**

- **Scenario 1: Guest viewing**
  Ada opens Chicly and views products and posts without logging in. All engagement actions (comment, save, follow, message, repost, purchase) are disabled. Expired posts automatically disappear.
- **Scenario 2: Buyer onboarding**
  Ada decides to create an account using phone, email, or Google to save favorites, follow vendors, and engage.
- **Scenario 3: Vendor onboarding (upgrade)**
  Chinedu signs up as a regular user, later upgrades to “Vendor” via profile settings by adding store details and documents.
- **Scenario 4: Creator onboarding (upgrade)**
  Ifunanya signs up normally, later upgrades to “Creator” via profile settings to manage content and collaborations.
- **Scenario 5: Password reset**
  Any user forgets their password and resets securely via OTP/email.

**Features In**

- Explore posts and products without login (view-only mode).
- Sign up via phone number, email, or Google.
- Account upgrade path: Buyer → Vendor → Creator (via profile).
- Secure login/logout.
- Password reset via OTP/email link.
- Expiration of guest-visible posts/products after configurable timeout.

**Features Out**

- Forced role selection at sign-up.
- Social logins other than Google (Facebook, Apple ID).
- Biometric login.

**Design (optional)**

- Lightweight flow (max 2 steps to log in).
- Explore page accessible without login, with engagement actions blocked.
- Profile upgrade screen for Vendor/Creator roles.
- Visual indication of expired listings/posts.

**Technical Considerations**

- OTP/email/Google verification service integration.
- Secure auth library (JWT-based).
- Backend integration with unified user DB (role upgrades handled in profile).
- Timeout/expiration mechanism for guest-visible listings.

**Success Metrics**

- < 15% drop-off rate during signup flow.
- 90%+ password reset success rate.
- At least 70% of vendors complete upgrades in profile.
- 100% of expired guest-visible posts are removed as per configured timeout.

**GTM Approach**

- Messaging: “Start browsing instantly. Upgrade anytime with phone, email, or Google.”
- Highlight “browse without login” in beta walkthrough.
- Show post/product expiration rules in guest view to maintain trust.

**Open Issues**

- Should vendors/creators require ID verification at upgrade stage or post-launch?
- Should phone verification be mandatory for all users?

**Q&A**

| Asked by        | Question                                       | Answer                                         |
| :-------------- | :--------------------------------------------- | :--------------------------------------------- |
| **Engineering** | Do we need both phone and email login for MVP? | Phone mandatory, email optional. Google added. |
| **Design**      | Can users browse without login?                | Yes, but all engagement actions are blocked.   |

**Feature Timeline and Phasing**

| Feature                                   | Status  | Sprint   | Dates         |
| :---------------------------------------- | :------ | :------- | :------------ |
| Browse products/posts without login       | Backlog | Sprint 1 | Sept 18–Oct 1 |
| Basic signup/login (phone, email, Google) | Backlog | Sprint 1 | Sept 18–Oct 1 |
| Password reset                            | Backlog | Sprint 1 | Sept 18–Oct 1 |
| Profile upgrade (Vendor/Creator)          | Backlog | Sprint 1 | Sept 18–Oct 1 |
| Post/product expiration (guest-visible)   | Backlog | Sprint 1 | Sept 18–Oct 1 |

**User Onboarding & Authentication Flow**

1. **App Launch (Guest Mode)**
   - Users browse posts and products without logging in.
   - Engagement actions (comment, save, follow, message, repost, purchase) are blocked.
   - Expired posts automatically disappear.
2. **Prompt to Sign Up / Log In**
   - Triggered when the user tries to engage with posts/products.
3. **Account Creation (Buyers, Vendors, Creators – same flow)**
   - Enter phone, email, or Google account.
   - OTP/email verification.
   - Create password (required).
   - Basic profile setup (name, profile picture optional).
4. **Dashboard Access**
   - New users land on their profile dashboard (default role: Buyer).
5. **Upgrade Path (Optional, Post-Onboarding)**
   - Upgrade to Vendor or Creator via profile settings.
   - Vendor: Add store details and documents.
   - Creator: Link social accounts, set up content.
6. **Password Reset**
   - Request OTP/email, reset password, and log in again.

**Acceptance Criteria**

- **Guest Browsing (View-Only Mode)**
  - Users should be able to browse posts and products without logging in.
  - Users should be prevented from performing engagement actions (comment, save, follow, message, repost, purchase) until they log in or sign up.
  - Expired posts or listings should automatically disappear after the configured timeout.
- **Signup / Account Creation**
  - Users should be able to sign up using a phone number, email, or Google account.
  - Users should complete OTP/email verification successfully before account creation is finalized.
  - Users should be able to complete the account creation flow in two steps or fewer.
- **Authentication & Session Management**
  - Users should be able to log in using phone number, email, or Google account.
  - Users’ sessions should be secured using JWT tokens (or equivalent).
  - Users should be able to log out, which should terminate the session and clear local data.
- **Password Reset**
  - Users should be able to request a password reset via OTP or email.
  - Password reset links or OTPs should expire after the configured timeframe.
  - Users should be required to use new credentials after a successful password reset; old credentials should be invalidated.
- **Profile Upgrade (Buyer → Vendor/Creator)**
  - Users should have a default role of Buyer upon account creation.
  - Users should be able to upgrade to Vendor or Creator only via profile settings.
  - Users upgrading to Vendor should be required to provide store details.
  - Users upgrading to Creator should be required to set up content and link social accounts.
- **Error Handling**
  - Users should receive clear error messages when OTP/email verification fails.
  - Users should be prevented from using weak passwords, with clear password requirements displayed.
  - Users should be redirected to the login screen upon session timeout.

**Feature PRD Status Flow**

1. Backlog – Drafted and stored.
2. In Review – Under PM/Product Owner review.
3. Ready for Development – Approved with acceptance criteria.
4. In Progress – Development/design underway.
5. In QA / Testing – Functional & acceptance testing.
6. Completed – Feature passes all criteria and deployed.

---

## Product Discovery & Browsing

| Role                   | Name / Team             |
| :--------------------- | :---------------------- |
| **Product Manager**    | Fadeke Toba             |
| **Engineering Lead**   | Princewill (Technical)  |
| **Designer**           | Adebimpe (Design Team)  |
| **Approvers/Sign-Off** | Adebimpe, Product Owner |
| **Current Status:**    | **Backlog**             |

**Overview**
Product Discovery is the core entry experience of Chicly. It enables users (buyers, vendors, creators) to explore posts and products without logging in, while surfacing trending, category-based, and vendor-specific items. Guest users can view content, but all engagement actions are blocked. Expired product listings/posts are automatically removed after a configured timeout. Discovery should be visually appealing, lightweight, and optimized for first-time users.

**Problem**
Instagram buyers and vendors struggle with scattered, unstructured browsing. Shoppers cannot easily find trustworthy vendors or products. Chicly must create a seamless, organized discovery flow that drives trust, repeat browsing, and vendor visibility, while maintaining content freshness.

**Objectives**

1. Allow users to browse posts/products without logging in, but restrict engagement actions (save, follow, message, comment, purchase).
2. Surface trending products, new vendors, and categories clearly.
3. Ensure product cards are optimized for quick decision-making (image-first, price visible).
4. Encourage login/signup when users attempt engagement.
5. Ensure expired posts/products are automatically removed after a configurable timeout.

**Constraints**

1. Discovery must be optimized for mobile-first (Android priority).
2. Image-heavy feeds require caching/CDN for smooth loading.
3. No advanced personalization in MVP (recommendation engine out).

**Persona**

| Key Persona                                    | Description                                                                               |
| :--------------------------------------------- | :---------------------------------------------------------------------------------------- |
| **Buyer (22–30 yrs, female/male, mid-income)** | Wants to see trending products quickly, scroll with minimal effort, and may log in later. |
| **Vendor (25–35 yrs, small business owner)**   | Wants products to appear visibly in discovery to attract new customers.                   |
| **Creator (18–35 yrs)**                        | Wants to showcase content and appear in discovery for collaborations.                     |

**Use Cases**

- **Scenario 1: Guest browsing**
  Ada opens Chicly and browses posts/products without logging in. Engagement actions are blocked. Expired posts automatically disappear.
- **Scenario 2: Vendor visibility**
  Chinedu lists products, which auto-appear in category/trending feeds once uploaded.
- **Scenario 3: Creator showcase**
  Ifunanya’s curated content appears in discovery for buyers to explore.
- **Scenario 4: Deep engagement prompt**
  Ada tries to save a product → app prompts her to log in.
- **Scenario 5: Search**
  User searches for a product → relevant results displayed; engagement actions blocked for guests.

**Features In**

- Explore feed accessible without login (view-only mode).
- Trending products section.
- Category browsing (e.g., clothes, bags, shoes).
- Product card with image, price, vendor name.
- Search bar for quick product lookup.
- Prompt to log in for engagement (save, follow, message).
- Expiration of guest-visible posts/products after configurable timeout.

**Features Out**

- AI personalization or smart recommendations.
- In-app checkout.
- Advanced vendor promotions (paid boosting).

**Design**

- Infinite scroll feed.
- Grid-based product layout.
- Sticky search bar at top.
- CTA overlays for login when engagement is attempted.
- Visual indication of expired listings/posts.

**Technical Considerations**

- CDN/image optimization for fast loading.
- Caching strategy for popular products.
- API endpoints for products, categories, trending.
- Timeout/expiration mechanism for guest-visible posts/products.

**Success Metrics**

- ≥70% of users engage with the discovery feed (views).
- <2s average load time for first feed.
- 50%+ of vendors’ listed products appear in discovery within 24 hrs.
- 100% of expired guest-visible posts removed after timeout.

**GTM Approach**

- Messaging: “Discover the best Instagram vendors in one place.”
- Highlight ease of browsing in beta walkthrough.
- Show content freshness and guest view capabilities.

**Open Issues**

- Should creators have a separate tab in discovery or mix with vendors?
- How frequently should trending products be refreshed?

**Q&A**

| Asked by        | Question                                       | Answer                                      |
| :-------------- | :--------------------------------------------- | :------------------------------------------ |
| **Design**      | Should discovery be image-first or text-heavy? | Image-first, text minimal.                  |
| **Engineering** | Do we need personalization at MVP?             | No, only trending and categories.           |
| **Engineering** | Are guest users allowed engagement?            | No, login required for save/follow/message. |

**Feature Timeline and Phasing**

| Feature                 | Status  | Sprint   | Dates        |
| :---------------------- | :------ | :------- | :----------- |
| Guest browsing          | Backlog | Sprint 2 | Oct 2–Oct 15 |
| Trending feed           | Backlog | Sprint 2 | Oct 2–Oct 15 |
| Category browsing       | Backlog | Sprint 2 | Oct 2–Oct 15 |
| Search                  | Backlog | Sprint 2 | Oct 2–Oct 15 |
| Post/product expiration | Backlog | Sprint 2 | Oct 2–Oct 15 |

**Product Discovery Flow**

1. **App Launch (Guest Mode)**
   - User land on discovery feed; can browse posts/products freely.
   - Engagement actions (save, follow, message, comment, purchase) blocked.
   - Expired posts auto-removed.
2. **Explore Products**
   - Grid layout with categories and trending sections.
   - Sticky search bar at top.
3. **Engage with Product**
   - Tap → product detail page (image, vendor name, price).
   - Attempting engagement triggers login/signup prompt.
4. **Vendor/Creator Visibility**
   - Newly uploaded products auto-surface in discovery feeds.
5. **Search**
   - Users can search for products; results show product cards.
   - Engagement blocked for guests; login prompted when attempted.

**Acceptance Criteria**

- **Guest Browsing (View-Only Mode)**
  - Users should be able to browse posts and products without logging in.
  - Users should be prevented from performing engagement actions (save, follow, message, comment, purchase) until they log in or sign up.
  - Expired posts or products should automatically disappear after the configured timeout.
- **Product Card Display**
  - Users should see product cards displaying image, price, and vendor name.
  - Product cards should load correctly in trending and category grids.
  - Infinite scroll should function properly without broken images or missing content.
- **Trending & Category Surfacing**
  - Trending products should be updated according to the configured schedule.
  - Category feeds should display all relevant products for the category.
  - Newly uploaded vendor or creator products should appear automatically in relevant feeds.
- **Search**
  - Users should be able to search for products and receive relevant results.
  - Guest users should see search results in view-only mode; engagement actions should trigger a login/signup prompt.
- **Engagement / Login Prompt**
  - Users attempting engagement actions (save, follow, message, comment, purchase) should be prompted to log in or sign up.
  - Users should be able to log in using phone number, email, or Google, consistent with onboarding flow.
- **Timeout / Expiration**
  - Guest-visible posts and products should expire after the configured period.
  - Expired posts and products should no longer appear in any feeds, including trending and category views.

**Feature PRD Status Flow**

1. Backlog – Drafted and stored.
2. In Review – Under PM/Product Owner review.
3. Ready for Development – Approved with acceptance criteria.
4. In Progress – Development/design underway (tasks in Linear).
5. In QA / Testing – Functional & acceptance testing.
6. Completed – Feature passes all criteria and deployed.

---

## Vendor Management & Product Listing

| Role                   | Name / Team               |
| :--------------------- | :------------------------ |
| **Product Manager**    | Fadeke Toba               |
| **Engineering Lead**   | Princewill (Technical)    |
| **Designer**           | Adebimpe (Design Team)    |
| **Approvers/Sign-Off** | Princewill, Product Owner |
| **Current Status:**    | **Backlog**               |

**Overview**
Vendor Management allows users who upgrade to “Vendor” to create and manage their store on Chicly. Vendors can upload and edit products, manage store details, and control visibility in the discovery feed. Expired products/posts are removed after a configurable timeout to maintain freshness. Buyers can view products without login, but engagement actions (save, message, follow, purchase) require login.

**Problem**
Instagram vendors face scattered operations, lack of structured product catalogs, and low visibility. Chicly must provide a simple, reliable vendor profile and product upload system to reduce friction, build trust, and support growth.

**Objectives**

1. Allow users to upgrade to vendors via profile settings.
2. Provide vendors with a structured store page (name, description, logo).
3. Enable vendors to upload and manage products (images, name, price, description).
4. Ensure products are visible in discovery within 24 hrs.
5. Expired products are automatically removed after a configured timeout.
6. Guest users can view products but cannot engage without login.

**Constraints**

1. Vendors must be able to upload from low-bandwidth environments.
2. Vendor verification (ID/documents) may be deferred post-launch.
3. No bulk upload in MVP (manual upload only).
4. Login via phone, email, or Google aligns with onboarding flow.

**Persona**

| Key Persona                           | Description                                                    |
| :------------------------------------ | :------------------------------------------------------------- |
| **Small business vendor (25–35 yrs)** | Wants a professional storefront to display products to buyers. |
| **Buyer (22–30 yrs, male/female)**    | Needs vendor credibility and structured product listings.      |

**Use Cases**

- **Scenario 1: Vendor upgrade**
  Chinedu signs up as a buyer, opens profile → clicks “Upgrade to Vendor”, fills store details, uploads ID later (optional).
- **Scenario 2: Product upload**
  Chinedu uploads images of sneakers, sets name, price, description → product appears in store and discovery feed.
- **Scenario 3: Store management**
  Chinedu edits store name, uploads logo → buyers see updated branding.
- **Scenario 4: Guest viewing**
  Buyers can view products without login, but cannot save, message, follow, or purchase.

**Features In**

- Vendor upgrade in profile settings.
- Vendor store page (name, logo, description).
- Product upload (image, name, price, description).
- Edit/delete products.
- Product visibility in discovery.
- Expiration of guest-viewable products after timeout.
- Login required for engagement actions (save, follow, message, purchase).

**Features Out**

- Bulk upload.
- Advanced analytics/dashboard for vendors.
- Vendor ads/promotions.

**Design**

- Vendor profile tab with storefront view (grid-first).
- Product upload form (image + fields).
- Simple store branding (logo + cover image).
- Visual indication for expired products.

**Technical Considerations**

- Image compression for uploads.
- Product DB linked to vendor profile.
- Caching/CDN for store/product images.
- Role management: buyer → vendor upgrade.
- Expiration mechanism for guest-viewable products.
- Login required for engagement actions.

**Success Metrics**

- 80%+ of vendors complete product upload successfully.
- 90%+ of products appear in discovery within 24 hrs.
- <10% error rate in uploads.
- 100% of expired products removed after timeout.
- Engagement actions blocked for guest users.

**GTM Approach**

- Messaging: “Your Instagram store, made official.”
- Highlight vendor storefront and easy product upload in beta launch.

**Open Issues**

- Should vendor verification be mandatory at MVP?
- Allow multiple stores per vendor or only one?

**Q&A**

| Asked by        | Question                                                | Answer                                               |
| :-------------- | :------------------------------------------------------ | :--------------------------------------------------- |
| **Design**      | Should the storefront look like an Instagram shop grid? | Yes, grid-first design.                              |
| **Engineering** | Bulk upload?                                            | No, MVP is manual upload only.                       |
| **Engineering** | Guest engagement allowed?                               | No, login required for save/follow/message/purchase. |

**Feature Timeline and Phasing**

| Feature                               | Status  | Sprint   | Dates         |
| :------------------------------------ | :------ | :------- | :------------ |
| Vendor upgrade                        | Backlog | Sprint 3 | Oct 16–Oct 29 |
| Storefront creation                   | Backlog | Sprint 3 | Oct 16–Oct 29 |
| Product upload                        | Backlog | Sprint 3 | Oct 16–Oct 29 |
| Product discovery visibility          | Backlog | Sprint 3 | Oct 16–Oct 29 |
| Expiration of guest-viewable products | Backlog | Sprint 3 | Oct 16–Oct 29 |

**Vendor Management Flow**

1. **Upgrade to Vendor**
   - User opens profile → “Upgrade to Vendor.”
   - Fill store name, logo, description.
2. **Create Storefront**
   - Storefront is created; vendors can upload products.
3. **Upload Products**
   - Add product → upload image, set price, name, description.
   - Product saved to the vendor store and pushed to discovery.
4. **Manage Products**
   - Vendors can edit or delete products anytime.
5. **Visibility & Expiration**
   - Products appear in the discovery feed within 24 hrs.
   - Expired guest-viewable products automatically removed.
6. **Guest Engagement**
   - Guest users can view products but cannot save, message, follow, or purchase.
   - Login required for any engagement action.

**Acceptance Criteria**

- **Vendor Upgrade**
  - Users should be able to upgrade from Buyer → Vendor via profile settings.
  - Users should be required to provide store name, logo, and description; ID/document upload should remain optional.
- **Storefront Creation**
  - Users should see the storefront successfully created and visible to buyer users.
  - Any edits to storefront details (name, logo, description) should be reflected in the discovery feed within 24 hours.
- **Product Upload / Management**
  - Vendors should be able to upload product images, name, price, and description.
  - Vendors should be able to edit or delete their products at any time.
  - Products should appear in the discovery feed within 24 hours of upload.
  - Product uploads should succeed for ≥80% of attempts.
  - Expired products should automatically be removed from the storefront and discovery feeds.
- **Guest Viewing**
  - Guest users should be able to view products in discovery feeds and vendor storefronts.
  - Engagement actions (save, follow, message, purchase) should be blocked for guests, with a login/signup prompt triggered when attempted.
- **Login / Engagement**
  - Users should be able to log in using phone numbers, email, or Google.
  - Successful login should enable engagement actions (save, follow, message, purchase).

**Feature PRD Status Flow**

1. Backlog – Drafted and stored.
2. In Review – Under PM/Product Owner review.
3. Ready for Development – Approved with acceptance criteria.
4. In Progress – Development/design underway (tasks in Linear).
5. In QA / Testing – Functional & acceptance testing.
6. Completed – Feature passes all criteria and deployed.

---

## Trust & Safety (Trust Score + Reviews)

| Role                   | Name / Team               |
| :--------------------- | :------------------------ |
| **Product Manager**    | Fadeke Toba               |
| **Engineering Lead**   | Princewill (Technical)    |
| **Designer**           | Adebimpe (Design Team)    |
| **Approvers/Sign-Off** | Princewill, Product Owner |
| **Current Status:**    | **Backlog**               |

**Overview**
Trust & Safety ensures Chicly users can confidently browse, shop, and interact with vendors. This includes vendor reviews, a transparent Trust Score system, and reporting mechanisms. Guest users can view reviews and scores but cannot engage (leave reviews or report vendors) without logging in. The goal is to reduce fraud, increase buyer confidence, and reward reliable vendors.

**Problem**
Instagram buyers face scams, fake reviews, and poor vendor accountability. Without trust mechanisms, buyers hesitate to purchase, and reliable vendors lose visibility. Chicly must provide a clear, fair, and real-time system to measure, display, and manage vendor trustworthiness.

**Objectives**

1. Users should be able to leave star ratings and text reviews after verified transactions.
2. The system should calculate a Trust Score based on ratings, verified reviews, responsiveness, and endorsements.
3. Trust Scores and reviews should be displayed clearly and consistently on vendor profiles.
4. Buyers should be able to report suspicious vendors or reviews, with Admins moderating flagged content.
5. Guest users should be able to view reviews and Trust Scores but must log in to engage.
6. The system should encourage trustworthy vendor behavior through transparency and accountability.

**Constraints**

1. The Trust Score formula must remain transparent but resistant to manipulation.
2. Verified purchases simulated via vendor confirmation (no in-app payments in MVP).
3. No AI fraud detection or automatic dispute resolution in MVP.
4. Reviews and Trust Score updates must propagate in real-time.

**Persona**

| Key Persona                            | Description                                             |
| :------------------------------------- | :------------------------------------------------------ |
| **Buyer (22–30 yrs, mid-income)**      | Needs reassurance before purchasing.                    |
| **Vendor (25–40 yrs, small business)** | Wants strong Trust Score to attract buyers.             |
| **Admin (Internal)**                   | Moderates flagged content and maintains platform trust. |

**Use Cases**

- **Scenario 1: Leaving a Review**
  User completes a purchase → leaves a star rating + text review → review linked to vendor profile.
- **Scenario 2: Trust Score Display**
  Vendor Trust Score updates automatically based on ratings, verified reviews, and responsiveness → displayed as “Trust Level: High” on profile.
- **Scenario 3: Reporting Abuse**
  Buyer suspects fake review/vendor → clicks “Report Vendor/Review” → Admin reviews and takes action.
- **Scenario 4: Guest Viewing**
  Guest users can view reviews and Trust Scores but cannot leave reviews or report vendors → login prompt triggered for engagement attempts.

**Features In**

- Ratings and text reviews linked to verified transactions.
- Real-time Trust Score calculation based on ratings, verified reviews, responsiveness, and endorsements.
- Trust Score badge displayed on vendor profiles (Low/Medium/High + numerical score).
- Guest users can view only; engagement requires login.

**Features Out**

- AI-driven fraud detection.
- In-app dispute resolution.
- Review gamification or incentives.

**Technical Considerations**

- Backend Trust Score calculation triggered real-time after each review/vendor action.
- Role-based Admin moderation dashboard.
- Database linking reviews → vendors → buyers with audit trail.
- Guest vs logged-in user flow enforcement for engagement actions.

**Success Metrics**

- ≥70% of completed transactions receive reviews.
- ≥90% of vendor profiles display Trust Score within 30 days.
- <5% of reviews flagged as fake/unhelpful.
- Real-time Trust Score update with <1-minute propagation delay.

**Feature Timeline and Phasing**

| Feature                         | Status  | Sprint   | Dates         |
| :------------------------------ | :------ | :------- | :------------ |
| Ratings & reviews               | Backlog | Sprint 3 | Nov 1–Nov 15  |
| Trust Score calculation         | Backlog | Sprint 3 | Nov 1–Nov 15  |
| Display Trust Score on profiles | Backlog | Sprint 3 | Nov 16–Nov 30 |
| Report vendor/review            | Backlog | Sprint 4 | Dec 1–Dec 10  |

**Trust & Safety Flow**

1. Transaction Completed → buyer can rate vendors (stars + optional text).
2. Review Submitted → review saved to vendor profile; inappropriate content flagged.
3. Trust Score Updated → backend recalculates in real-time.
4. Score Displayed → vendor profile shows updated Trust Score badge + reviews.
5. Report Vendor/Review → buyer taps report → Admin reviews flagged content.

**Acceptance Criteria**

- **Ratings & Reviews**
  - Logged-in users should be able to leave a star rating and optional text review after a verified purchase.
  - Users should be able to edit or delete their own reviews within a configurable timeframe.
  - Reviews should appear on vendor profiles immediately after submission.
- **Trust Score Calculation**
  - The system should calculate Trust Score based on ratings, verified reviews, vendor responsiveness, and endorsements.
  - Trust Score should update in real-time after each new review or vendor action.
- **Trust Score Display**
  - Vendor profiles should display Trust Score badge (Low/Medium/High + optional numerical value).
  - Trust Score should reflect the most current calculation at all times.
- **Reporting Vendors/Reviews**
  - Logged-in buyers should be able to report vendors or suspicious reviews.
  - Admin should receive flagged reports and be able to moderate or remove content promptly.
  - Reports should trigger notifications to Admin for timely review.
- **Guest Users**
  - Guest users should be able to view reviews and Trust Scores.
  - Guest users should not be able to leave reviews or report vendors.
  - Engagement attempts by guests should trigger a login/signup prompt.
- **Error Handling & Edge Cases**
  - Inappropriate reviews should be flagged for moderation.
  - Missing or invalid Trust Score data should default to “Pending” until resolved.
  - Edited or deleted reviews should trigger Trust Score recalculation.

---

## Wishlist / Favorites

| Role                   | Name / Team               |
| :--------------------- | :------------------------ |
| **Product Manager**    | Fadeke Toba               |
| **Engineering Lead**   | Princewill (Technical)    |
| **Designer**           | Adebimpe (Design Team)    |
| **Approvers/Sign-Off** | Princewill, Product Owner |
| **Current Status:**    | **Backlog**               |

**Overview**
Wishlist/Favorites allows users to save products they like while browsing, so they can revisit later without searching again. Guest users can view products but cannot save/favorite without logging in. This feature increases engagement, creates a sense of ownership, and drives repeat app usage. Saved products auto-update with vendor changes and expire if the listing is removed.

**Problem**
On Instagram, buyers often lose track of vendors or products because there’s no in-app way to bookmark items. Screenshots or DM-ing links are inefficient. Chicly needs a reliable in-app system for saving favorites while maintaining accurate product info and encouraging user registration.

**Objectives**

1. Allow users to favorite products with a single tap (heart icon or a cart)
2. Provide a dedicated Wishlist page under the user profile showing all saved items.
3. Enable guest users to browse products, but restrict engagement actions (saving/favoriting) until login.
4. Prompt guest users to log in/register when attempting to save, via phone number, email, or Google.
5. Sync saved product details (image, price, vendor) with vendor updates.
6. Automatically remove expired or deleted products from Wishlists.
7. Limit Wishlist to 100 products per user in MVP.

**Constraints**

- Wishlist is personal; sharing or collaborative lists excluded in MVP.
- Saved products tied to user accounts (not device-only).
- No offline caching of Wishlists in MVP.

**Persona**

| Key Persona                                  | Description                                                                                          |
| :------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **Buyer (22–30 yrs, female, mid-income)**    | Wants to save products she likes without buying immediately.                                         |
| **Vendor (25–40 yrs, small business owner)** | Wants buyers to save their products for future purchases, increasing visibility and potential sales. |

**Use Cases**

- **Scenario 1: Saving a Product**
  Ada scrolls the discovery feed → taps heart icon on a handbag → item is added to her Wishlist.
- **Scenario 2: Guest Login Prompt**
  Chinedu browsing as a guest → taps heart on sneakers → app prompts login/signup via phone, email, or Google.
- **Scenario 3: Accessing Wishlist**
  Ada opens her profile → taps “Wishlist” → sees all saved items with updated prices and vendor info.
- **Scenario 4: Wishlist Sync & Expiration**
  Vendor updates product price/image → saved product reflects changes.
  Product deleted by vendor → automatically removed from all Wishlists.

**Features In**

- Heart/favorite icon on product cards.
- Wishlist tab under user profile.
- Sync with user account; auto-update product info.
- Guest users can browse but are blocked from saving/favoriting until login.
- Expired or deleted products removed automatically.

**Features Out**

- Public or shareable Wishlists.
- Price-drop notifications.
- Collaborative Wishlists with friends/family.

**Design (optional)**

- Heart icon toggled on/off.
- Grid-based Wishlist view under profile.
- Empty state: “You haven’t saved any products yet.”

**Technical Considerations**

- API for saving/removing Wishlist items.
- Database table linking users → saved products.
- Sync mechanism for updating saved product info.
- Enforcement of guest vs. logged-in engagement actions.
- Automatic removal of expired/deleted products.

**Success Metrics**

- ≥50% of logged-in users save ≥1 product in first 30 days.
- 30% of saved products are revisited within one week.
- <5% sync errors for saved product updates.
- Guest users attempting to save are correctly prompted to log in.

**GTM Approach**

- Messaging: “Save your faves. Come back anytime.”
- Highlight Wishlist in onboarding tutorial and beta campaign.
- Emphasize browsing without login, but encourage sign-up to save favorites.

**Open Issues**

- Should anonymous (guest) wishlists cached on devices be allowed?
- Should saved products automatically expire if vendor deletes the listing?

**Q&A**

| Asked by        | Question                                                | Answer                    |
| :-------------- | :------------------------------------------------------ | :------------------------ |
| **Design**      | Should Wishlist appear in profile or bottom navigation? | Profile tab in MVP.       |
| **Engineering** | Do we need offline saving support?                      | Not for MVP; online only. |

**Feature Timeline and Phasing**

| Feature                        | Status  | Sprint   | Dates         |
| :----------------------------- | :------ | :------- | :------------ |
| Favorite icon on product cards | Backlog | Sprint 3 | Nov 16–Nov 30 |
| Wishlist page                  | Backlog | Sprint 3 | Nov 16–Nov 30 |
| Sync with account              | Backlog | Sprint 4 | Dec 1–Dec 10  |

**Wishlist Flow**

1. **Browse Products**
   - User scrolls discovery feed (guest or logged-in).
2. **Save to Wishlist**
   - Tap heart icon → product saved (login required for guests).
3. **Access Wishlist**
   - Profile → “Wishlist” tab → view saved products.
4. **Manage Wishlist**
   - Tap heart again → remove item.
   - Auto-update saved product info from vendor changes.
   - Expired/deleted products removed automatically.

**Acceptance Criteria**

- **Guest Browsing (View-Only Mode)**
  - Users should be able to browse products without logging in.
  - Users should be able to attempt saving or favoriting a product, which triggers a login/signup modal offering phone, email, or Google as options.
  - Users should be able to see expired or deleted products automatically removed from discovery feeds.
- **Saving / Wishlist Management**
  - Users should be able to save products to their Wishlist by tapping the heart icon once logged in.
  - Users should be able to remove saved products by tapping the heart icon again.
  - Users should be able to see saved products automatically updated when the vendor changes price, image, or product information.
  - Users should be able to save up to 100 products in their Wishlist.
  - Users should be able to see deleted or expired products automatically removed from their Wishlist.
- **Wishlist Page**
  - Users should be able to view all saved products under the profile’s Wishlist tab.
  - Users should be able to see product cards displaying image, price, vendor name, and heart icon status.
  - Users should be able to scroll infinitely through their Wishlist grid layout without broken images.
- **Login / Engagement**
  - Users should be able to log in or register via phone, email, or Google when attempting to save a product as a guest.
  - Logged-in users should be able to perform save or un-save actions immediately without delay.
- **Error Handling & Edge Cases**
  - Users should be able to see descriptive error messages for failed login or signup attempts.
  - Users should be able to see an informational message if they attempt to save beyond 100 products.
  - Users should be able to see removed or expired products automatically disappear from their Wishlist.

**Feature PRD Status Flow**

1. Backlog – Drafted and stored.
2. In Review – Under review by PM/Product Owner.
3. Ready for Development – Approved with clear acceptance criteria.
4. In Progress – Development/design underway (tasks in Linear).
5. In QA / Testing – Functional & acceptance testing.
6. Completed – Feature passes all criteria and deployed.

---

## Escrow & Order Management (No Checkout)

| Role                   | Name / Team               |
| :--------------------- | :------------------------ |
| **Product Manager**    | Fadeke Toba               |
| **Engineering Lead**   | Princewill (Technical)    |
| **Designer**           | Adebimpe (Design Team)    |
| **Approvers/Sign-Off** | Princewill, Product Owner |
| **Current Status:**    | **Backlog**               |

**Overview**
This feature introduces Escrow & Order Management to ensure safe transactions between buyers and vendors without enabling direct in-app checkout. Chicly acts as a neutral third party: funds are held in escrow until buyers confirm receipt of goods, reducing fraud and improving trust.
Guest users can view products but cannot place orders; attempting to engage triggers a login/signup prompt (phone, email, or Google). Orders from expired or deleted products are automatically prevented.

**Problem**
Instagram buyers face scams and abandoned transactions, while vendors experience disputes with no traceable solution. Without structured order management, trust is low. Chicly must provide escrow-backed order handling to safeguard transactions while keeping checkout out of MVP.

**Objectives**

1. Ensure buyers can safely pay for products using escrow.
2. Enable vendors to track and manage incoming orders efficiently.
3. Prevent fraud by releasing funds only after the buyer confirms delivery.
4. Support transparent dispute handling for unresolved transactions.
5. Encourage guests to sign up/login before placing orders.
6. Automatically block orders for expired or deleted products.

**Constraints**

1. No in-app card payments (checkout excluded from MVP).
2. Escrow must support Nigerian payment channels (Paystack/Flutterwave).
3. Escrow release is manual in disputes.
4. Guest users cannot engage with orders; login/signup is required.

**Persona**

| Key Persona                       | Description                                                         |
| :-------------------------------- | :------------------------------------------------------------------ |
| **Buyer (22–30 yrs, mid-income)** | Needs assurance that money is held safely until the item arrives.   |
| **Vendor (25–35 yrs)**            | Needs timely notifications and reliable order fulfillment tracking. |

**Use Cases**

- **Scenario 1: Guest Viewing**
  A guest browsing Chinedu’s sneakers cannot place an order; attempting to purchase triggers a login/signup modal (phone, email, Google).
- **Scenario 2: Buyer Places Order**
  Ada selects sneakers → pays into escrow via Paystack/Flutterwave → Chicly holds funds until she confirms delivery.
- **Scenario 3: Vendor Receives Order**
  Chinedu receives in-app notification → updates status to “Shipped.”
- **Scenario 4: Order Completion**
  Ada confirms delivery → escrow releases funds to Chinedu.
- **Scenario 5: Dispute Handling**
  Ada claims “item not delivered” → admin reviews → manually resolves dispute (refund/release).

**Features In**

- Escrow wallet system integrated with Paystack/Flutterwave.
- Vendor order management dashboard (view, update status).
- Buyer order tracking (pending, shipped, delivered).
- Funds released only upon buyer confirmation.
- Manual dispute resolution by admin.
- Guest restrictions: no order placement or engagement without login.
- Automatic prevention of orders for expired/deleted products.

**Features Out**

- Full in-app card checkout.
- Automatic refunds without admin intervention.
- International payment support.

**Design (optional)**

- Vendor “Orders” tab showing all orders by status.
- Buyer “My Orders” tab with escrow status.
- Clear escrow info on order confirmation page.
- Login/signup modal when guest attempts to place order.

**Technical Considerations**

- Integration with Paystack/Flutterwave escrow APIs.
- Notification service (push + email) for order updates.
- Admin tools for manual dispute resolution.
- Guest vs. logged-in user flow enforcement.
- Validation for expired/deleted products before order placement.

**Success Metrics**

- ≥80% of orders processed through escrow.
- ≤10% dispute rate per order.
- ≥95% of funds released within 48 hrs of buyer confirmation.
- 100% of guest users attempting orders are prompted to login/signup.
- 100% of expired/deleted products blocked from orders.

**GTM Approach**

- Messaging: “Shop safe with Chicly Escrow – your money is protected until you get your item.”
- Beta campaign highlights escrow safety and dispute resolution.
- Onboarding emphasizes guest login requirements before ordering.

**Open Issues**

- Should partial deposit payments be allowed in MVP?
- Who bears escrow fees – buyer, vendor, or split?

**Q&A**

| Asked by        | Question                                               | Answer                                        |
| :-------------- | :----------------------------------------------------- | :-------------------------------------------- |
| **Engineering** | Build wallet or integrate Paystack/Flutterwave escrow? | Integrate Paystack/Flutterwave escrow API.    |
| **Design**      | Show escrow status on product cards?                   | No, only inside Orders dashboard.             |
| **PM**          | How to handle expired products?                        | Orders blocked automatically; buyer notified. |

**Feature Timeline and Phasing**

| Feature                        | Status  | Sprint   | Dates         |
| :----------------------------- | :------ | :------- | :------------ |
| Escrow wallet integration      | Backlog | Sprint 4 | Oct 30–Nov 12 |
| Vendor order dashboard         | Backlog | Sprint 4 | Oct 30–Nov 12 |
| Buyer order tracking           | Backlog | Sprint 4 | Oct 30–Nov 12 |
| Dispute handling (admin tools) | Backlog | Sprint 5 | Nov 13–Nov 26 |

**Escrow & Order Management Flow**

1. **Guest Browsing / Attempted Engagement**
   - Guests can browse products in discovery feeds but cannot place orders.
   - Attempting to order triggers a login/signup modal offering phone, email, or Google login.
2. **Order Creation**
   - Logged-in users select a product and place an order.
   - Payment is securely sent to Chicly escrow via Paystack/Flutterwave.
   - Order confirmation displays escrow status and order details.
3. **Order Processing**
   - Vendor receives order notification in dashboard.
   - Vendor updates order status (Pending → Shipped).
   - Order status updates propagate to the buyer in real time.
4. **Delivery Confirmation**
   - The buyer confirms receipt of the product.
   - Escrowed funds are released to the vendor’s wallet.
   - Buyer sees confirmation of fund release.
5. **Dispute Handling**
   - Buyer can raise a dispute if the item is not delivered or is unsatisfactory.
   - Admin reviews the dispute and resolves it manually by releasing or refunding escrowed funds.
   - Both buyer and vendor are notified of the outcome.
6. **Expired / Deleted Products**
   - Products that are expired or deleted cannot be ordered.
   - Buyers attempting to interact with such products receive a clear notification.

**Acceptance Criteria**

- **Guest Browsing**
  - Users should be able to browse products without logging in.
  - Users should be able to attempt placing an order as a guest, which triggers login/signup modal with options: phone, email, Google.
  - Users should be able to see that expired or deleted products are blocked from ordering.
- **Order Placement / Escrow**
  - Users should be able to place orders only when logged in.
  - Users should be able to have funds securely held in escrow until delivery confirmation.
  - Users should be able to see escrow status for all their orders.
  - Users should be able to cancel orders only if the vendor has not shipped.
- **Vendor Order Management**
  - Users should be able to view all incoming orders in a dashboard.
  - Users should be able to update order status (Pending → Shipped → Delivered).
  - Users should be able to track escrowed funds for each order.
- **Delivery Confirmation & Fund Release**
  - Users should be able to confirm delivery to release escrowed funds.
  - Users should be able to see real-time updates on fund release status.
- **Dispute Handling**
  - Users should be able to file a dispute if the item is not received or is unsatisfactory.
  - Admin should be able to review disputes and manually release/refund escrowed funds.
- **Error Handling & Edge Cases**
  - Users should be able to see descriptive errors if escrow payment fails.
  - Users should be able to see blocked notifications when attempting to order expired/deleted products.
  - Users should be able to see guidance if a dispute is under review.

---

## Notifications & Engagement

| Role                   | Name / Team               |
| :--------------------- | :------------------------ |
| **Product Manager**    | Fadeke Toba               |
| **Engineering Lead**   | Princewill (Technical)    |
| **Designer**           | Adebimpe (Design Team)    |
| **Approvers/Sign-Off** | Princewill, Product Owner |
| **Current Status:**    | **Backlog**               |

**Overview**
Notifications & Engagement keep buyers and vendors connected to Chicly by delivering timely alerts, reminders, and promotional nudges. The feature ensures users do not miss critical updates, drives repeat engagement, and maintains platform stickiness. Guest users can browse notifications but cannot act on them until they log in.

**Problem**
On Instagram, messages and updates are easily lost in clutter. Vendors miss order alerts, and buyers forget deliveries or wishlist restocks. Without structured notifications, users disengage, trust decreases, and transactions drop. Chicly must provide real-time, relevant notifications, while respecting guest browsing rules.

**Objectives**

1. Keep users informed about critical events: orders, escrow updates, and disputes.
2. Encourage repeat engagement through wishlist/favorites alerts and vendor promotions.
3. Maintain guest browsing rules: allow viewing notifications without login but block all engagement actions until authentication.
4. Ensure product and post expiration applies to notifications for guests.
5. Enable secure login/signup via phone, email, or Google when attempting engagement.

**Constraints**

1. Push notifications available for mobile (Android first, iOS later).
2. Email fallback required for critical notifications.
3. SMS not included in MVP.
4. Engagement actions (confirm delivery, claim disputes, wishlist interactions, promo clicks) require login.

**Persona**

| Key Persona                       | Description                                                                   |
| :-------------------------------- | :---------------------------------------------------------------------------- |
| **Buyer (22–30 yrs, mid-income)** | Needs timely alerts for orders, wishlist restocks, and delivery confirmation. |
| **Vendor (25–35 yrs)**            | Needs real-time updates on new orders, buyer actions, and disputes.           |

**Use Cases**

- **Scenario 1: Order Update**
  Ada places an order. Logged-in users get push/email notifications: “Your sneakers are shipped by Chinedu. Confirm delivery when received.” Guests see notification but must log in to act.
- **Scenario 2: Vendor Alert**
  Chinedu receives push/email notification: “New order placed by Ada – check your Orders dashboard.” Guest users cannot see order details.
- **Scenario 3: Wishlist Engagement**
  Ada favorited a handbag. Two weeks later, notification: “The handbag you love is back in stock – shop now!” Guests can see the notification but must log in to purchase or save.
- **Scenario 4: Promotional Engagement**
  Vendors send a limited-time promo: “Get 10% off today only – valid until midnight.” Guests can view but cannot claim the promo without logging in.

**Features In**

- Push notifications for orders (placed, shipped, delivered, disputed).
- Escrow alerts (funds held, released, disputed).
- Wishlist/favorites restock notifications.
- Vendor promotional broadcasts (limited, admin-approved).
- Email fallback for critical notifications.
- Guest view-only mode: browsing allowed, engagement blocked.

**Features Out**

- SMS notifications.
- Full notification preference center (Phase 2).
- AI-powered personalized recommendations (Phase 2).

**Design (optional)**

- Bell icon with notification badge.
- Notifications tab showing history with time and category.
- Engagement card design for wishlist and promo notifications.
- Visual distinction between system alerts (orders/escrow) and promo cards.

**Technical Considerations**

- Firebase Cloud Messaging (FCM) for Android.
- APNs support for iOS (post-beta).
- Notification queue to prevent duplicates.
- Admin tools for promotional approval.
- Guest vs. logged-in handling: engagement triggers login/signup modal with phone/email/Google options.

**Success Metrics**

- ≥85% of buyers receive and open critical notifications.
- <5% of vendors miss new order alerts.
- Engagement CTR ≥10% on wishlist/promo notifications.
- 15% increase in repeat sessions via notifications.
- 100% of notifications related to expired guest-viewable products are blocked.

**GTM Approach**

- Messaging: “Never miss an update – Chicly keeps you connected.”
- Beta tutorial highlights guest browsing vs. logged-in engagement.
- Early vendor campaigns encourage admin-approved promotions.

**Open Issues**

- Should vendors pay to send promotional notifications in MVP?
- Should guests be able to cache notifications locally?
- Should buyers be able to mute wishlist/promo alerts in MVP?

**Q&A**

| Asked by        | Question                                                   | Answer                                                         |
| :-------------- | :--------------------------------------------------------- | :------------------------------------------------------------- |
| **Engineering** | Should notifications be real-time or batch?                | Real-time for critical events, batch for promos.               |
| **Design**      | Should engagement promos look different from order alerts? | Yes – promos styled as cards; system alerts for orders/escrow. |

**Feature Timeline and Phasing**

| Feature                          | Status  | Sprint   | Dates         |
| :------------------------------- | :------ | :------- | :------------ |
| Push notifications setup         | Backlog | Sprint 4 | Oct 30–Nov 12 |
| Email fallback integration       | Backlog | Sprint 4 | Oct 30–Nov 12 |
| Wishlist restock alerts          | Backlog | Sprint 5 | Nov 13–Nov 26 |
| Vendor promos (admin-controlled) | Backlog | Sprint 6 | Nov 27–Dec 10 |

**Notifications & Engagement Flow**

1. **Guest Browsing / Attempted Engagement**
   - Users can browse notifications and history without logging in.
   - Attempting to engage triggers login/signup modal with phone, email, or Google.
   - Notifications about expired/deleted products are blocked for guests.
2. **Trigger Event**
   - Order update, escrow change, wishlist restock, or vendor promo occurs.
3. **Notification Dispatch**
   - Backend sends push/email notifications to logged-in users.
   - Guests attempting engagement receive a login/signup prompt.
4. **User Action**
   - Logged-in users click notification → redirected to Orders, Wishlist, or Promo page.
   - Guests can view only, cannot act.
5. **Engagement Outcome**
   - Buyers confirm deliveries, engage wishlist, or purchase.
   - Vendors update order status or approve dispute resolutions.
6. **Error & Edge Case Handling**
   - Failed notifications retried automatically.
   - Expired/deleted products do not generate notifications.
   - Guest engagement attempts trigger login/signup modal.

**Acceptance Criteria**

- **Guest Browsing / View-Only Mode**
  - Users should be able to browse notifications without logging in.
  - Users should be prevented from performing engagement actions (confirm delivery, wishlist/promo interaction, etc.) until they log in or sign up.
  - Notifications about expired/deleted products should not appear to guests.
- **Login / Engagement**
  - Users should be able to log in via phone, email, or Google to engage with notifications.
  - Logged-in users should be able to perform engagement actions immediately after authentication.
- **Notification Dispatch**
  - Users should be able to receive push notifications for order updates, escrow events, wishlist restocks, and approved promotions.
  - Users should be able to receive email fallback notifications if push delivery fails.
- **Error Handling & Edge Cases**
  - Users should be able to see descriptive errors if notifications fail.
  - Users should be able to see guidance if a notification relates to expired or deleted products.

---

## Messaging & Communication (WhatsApp MVP)

| Role                   | Name / Team               |
| :--------------------- | :------------------------ |
| **Product Manager**    | Fadeke Toba               |
| **Engineering Lead**   | Princewill (Technical)    |
| **Designer**           | Adebimpe (Design Team)    |
| **Approvers/Sign-Off** | Princewill, Product Owner |
| **Current Status:**    | **Backlog**               |

**Overview**
Messaging in Chicly (Beta) allows buyers to contact vendors via WhatsApp deep links. Guests can browse products and see messaging CTAs but cannot message vendors without logging in. Expired or deleted products automatically block messaging attempts. Users must log in/sign up via phone, email, or Google to engage. Expired product listings are visible only to logged-in users after verification. MVP does not include in-app chat.

**Problem**
On Instagram, buyers and vendors communicate mainly through DMs or WhatsApp. Without structured messaging, buyers abandon interactions, and vendors cannot track engagement. A lightweight, controlled MVP ensures minimal friction, preserves trust, and captures engagement data.

**Objectives**

1. Allow guest users to browse products but block messaging vendors until login/signup.
2. Enable secure login/signup via phone, email, or Google to message vendors.
3. Allow vendors to add validated WhatsApp numbers during onboarding/upgrade.
4. Track messaging attempts for analytics.
5. Block messaging on expired or deleted products.
6. Maintain MVP limitation: in-app chat is Phase 2.
7. Notify users that product listings expire after configured timeout; guests must log in to see expired products.

**Constraints**

1. No in-app chat (Phase 2+).
2. Guest users cannot message vendors.
3. Expired or deleted product listings block messaging until the user signs in.
4. WhatsApp deep links must open natively on Android and iOS.

**Persona**

| Key Persona            | Description                                                                                           |
| :--------------------- | :---------------------------------------------------------------------------------------------------- |
| **Buyer (22–30 yrs)**  | Wants to quickly message vendors about product availability or price but may browse first as a guest. |
| **Vendor (25–35 yrs)** | Wants buyers to reach them quickly through verified WhatsApp numbers; needs analytics of engagement.  |

**Use Cases**

- **Scenario 1: Guest browsing**
  Ada sees products and the “Message Vendor” button but cannot initiate messaging. Attempting triggers login/signup modal (phone, email, Google). Expired/deleted products are blocked.
- **Scenario 2: Buyer messaging vendor**
  Logged-in Ada taps “Message Vendor” → WhatsApp opens with the vendor's validated number.
- **Scenario 3: Vendor setup**
  Chinedu adds WhatsApp number during profile upgrade → Chicly validates number.
- **Scenario 4: Analytics tracking**
  Click logged: “Buyer X attempted vendor chat” → used for vendor performance analytics.
- **Scenario 5: Expired/Deleted products**
  Guest or logged-in user tries messaging an expired product → action blocked; user sees message “Product expired. Sign up/log in to view details.”

**Features In**

- Guest browsing mode (view-only for messaging).
- Login/signup required to message vendors (phone, email, Google).
- “Message Vendor” button → WhatsApp deep link.
- Vendor WhatsApp number management (add/edit, validation).
- Analytics tracking for messaging clicks.
- Block expired/deleted products from messaging.

**Features Out**

- In-app chat.
- File/image sharing in-app.
- Buyer-to-buyer messaging.

**Design (optional)**

- CTA: “Message Vendor on WhatsApp.”
- Confirmation modal (optional): “You are about to open WhatsApp to chat with this vendor.”
- Visual indicator for expired/deleted products (blocked messaging).

**Technical Considerations**

- WhatsApp deep link: <https://wa.me/><vendor_number>.
- Validate vendor WhatsApp numbers on entry.
- Track clicks on CTA for analytics.
- Enforce guest mode restrictions and login/signup triggers.
- Timeout mechanism for guest-visible listings; expired products require login to view.

**Success Metrics**

- 80%+ vendors provide valid WhatsApp numbers.
- ≥60% of product detail views result in “Message Vendor” clicks.
- <5% WhatsApp link failures.
- 100% of messaging attempts blocked on expired/deleted products for guests.

**GTM Approach**

- Messaging: “Chat directly with vendors on WhatsApp – fast, familiar, and secure.”
- Highlight WhatsApp messaging in beta onboarding guide.
- Show product expiration rules to guests.

**Open Issues**

- Multiple vendor numbers?
- Disclaimer for WhatsApp chats?
- Should guests cache messaging attempts locally?

**Q&A**

| Asked by        | Question                             | Answer                                    |
| :-------------- | :----------------------------------- | :---------------------------------------- |
| **Engineering** | Do we need in-app messaging for MVP? | No, redirect to WhatsApp only.            |
| **Design**      | CTA text?                            | “Message Vendor on WhatsApp” for clarity. |

**Feature Timeline and Phasing**

| Feature                     | Status  | Sprint   | Dates         |
| :-------------------------- | :------ | :------- | :------------ |
| Vendor WhatsApp setup       | Backlog | Sprint 3 | Oct 16–Oct 29 |
| “Message Vendor” CTA        | Backlog | Sprint 3 | Oct 16–Oct 29 |
| Click logging for analytics | Backlog | Sprint 3 | Oct 16–Oct 29 |

**Messaging & Communication Flow**

1. **Guest Browsing / Attempted Engagement**
   - Users can browse products and see “Message Vendor” CTA.
   - Messaging attempts trigger login/signup modal (phone, email, Google).
   - Expired/deleted products are blocked; users must log in to view.
2. **Vendor Setup**
   - Vendors add WhatsApp number → validated by Chicly.
3. **Buyer Engagement**
   - Logged-in users tap “Message Vendor” → WhatsApp opens via deep link.
4. **Analytics Tracking**
   - Click logged as “Buyer started WhatsApp chat.”
5. **Error & Edge Case Handling**
   - Failed deep link opens show descriptive error.
   - Messaging attempts blocked for expired/deleted products.
   - Guest attempts always trigger login/signup modal.

**Acceptance Criteria**

- **Guest Browsing / View-Only Mode**
  - Users should be able to browse products and see “Message Vendor” CTA without logging in.
  - Users should be prevented from messaging vendors until logged in or signed up.
  - Users should see expired/deleted products blocked; login/signup required to view.
- **Login / Engagement**
  - Users should be able to sign up/log in via phone, email, or Google to message vendors.
  - Logged-in users should be able to tap “Message Vendor” to open WhatsApp immediately.
- **Vendor Setup & Validation**
  - Users should be able to add or edit WhatsApp numbers in profile.
  - Vendors’ WhatsApp numbers should be validated for correct format before saving.
- **Messaging & Analytics**
  - Users should be able to see the WhatsApp deep link open natively on Android/iOS.
  - Users’ click events should be logged for analytics.
- **Error Handling & Edge Cases**
  - Users should see descriptive errors if WhatsApp fails to open.
  - Users should see guidance when messaging expired or deleted products.
  - Guest attempts always trigger login/signup modal consistently.

---

## Creator Tools

| Role                   | Name / Team               |
| :--------------------- | :------------------------ |
| **Product Manager**    | Fadeke Toba               |
| **Engineering Lead**   | Princewill (Technical)    |
| **Designer**           | Adebimpe (Design Team)    |
| **Approvers/Sign-Off** | Princewill, Product Owner |
| **Current Status:**    | **Backlog**               |

**Overview**
Creator Tools allow users to upgrade from regular accounts to Creator, showcase content, curated product lists, and vendor collaborations. Guests can browse creator content but cannot engage (follow, save, message vendors, or purchase) until they log in/sign up via phone, email, or Google. Expired/deleted products in creator collections are blocked for guests, visible only to logged-in users. This ensures discovery while maintaining trust, freshness, and controlled engagement.

**Problem**
Instagram creators lack structured ways to monetize through vendor partnerships. Without Chicly creator tools, buyers miss inspiration-led shopping, vendors lose visibility, and creators have fewer incentives. Guest browsing must not allow engagement, and expired content must be hidden from unregistered users to maintain platform integrity.

**Objectives**

1. Allow users to upgrade to Creator via profile settings.
2. Provide tools for curated product lists, collections, and vendor collaborations.
3. Maintain guest browsing with engagement restrictions.
4. Ensure product expiration rules apply to guest-visible content.
5. Enable secure login/signup via phone, email, or Google before engagement actions.
6. Build trust and structured discovery while deferring advanced monetization and analytics to Phase 2.

**Constraints**

1. Beta launch: Android Dec 20, 2025; iOS Dec 28, 2025.
2. Guest engagement is blocked until login/signup.
3. Expired or deleted products are invisible or blocked for guests.
4. Advanced creator analytics and monetization Phase 2.
5. Vendor–creator collaboration payments handled manually until escrow integration.

**Persona**

| Key Persona             | Description                                                                    |
| :---------------------- | :----------------------------------------------------------------------------- |
| **Creator (18–35 yrs)** | Wants to showcase content, collaborate with vendors, inspire buyers.           |
| **Buyer (22–30 yrs)**   | Browses creator content, follows creators, purchases from curated collections. |
| **Vendor (25–35 yrs)**  | Collaborates with trusted creators to boost product visibility.                |

**Use Cases**

- **Scenario 1: Guest browsing**
  Ada sees creators and collections but cannot follow, save, or message vendors. Expired/deleted products in collections are blocked until she signs up/logs in.
- **Scenario 2: Upgrade to Creator**
  Ifunanya taps “Upgrade to Creator” → sets bio, profile picture, links social accounts → gains access to creation tools.
- **Scenario 3: Curated product lists**
  Creator selects vendor products, groups them into collections (e.g., “Wedding Looks”) → publishes for followers.
- **Scenario 4: Vendor–creator collaboration**
  Vendor products tagged in creator collections. Analytics track engagement clicks.
- **Scenario 5: Buyer discovery**
  Logged-in buyer follows creators, views collections, and taps products → redirected to vendor listings for purchase.

**Features In**

- Creator profile upgrade (from profile settings).
- Curated product lists / collections.
- Vendor collaborations (tagged products).
- Dedicated Creator tab/section for discovery.
- Guest browsing mode with blocked engagement.
- Login/signup via phone, email, Google for engagement.
- Expired/deleted products blocked for guests.

**Features Out**

- Creator earnings dashboard (Phase 2).
- Escrow payments for collaborations (Phase 2).
- Deep engagement analytics (Phase 2).

**Design (optional)**

- Creator tab with grid-style content cards.
- Highlights: curated lists, collaborations.
- Guest view shows disabled engagement actions.
- Expired/deleted products visually blocked for guests.

**Technical Considerations**

- “Creator” role flag in user DB.
- Collections linked to vendor product catalog.
- Vendor–creator link stored in backend.
- Guest mode enforcement (blocked engagement).
- Expiration mechanism for guest-visible products.

**Success Metrics**

- 30% of creators onboard within the first 2 months.
- 20%+ of buyers engage weekly with creator content.
- 10+ vendor–creator collaborations in the first 3 months.
- 100% expired guest-visible products blocked.

**GTM Approach**

- Messaging: “Creators inspire, you shop with trust.”
- Recruit early Instagram fashion influencers in Nigeria.
- Highlight “browse as guest, upgrade to engage” during onboarding.

**Open Issues**

- Who initiates vendor–creator collaborations?
- Should curated lists allow price edits, or only pull vendor prices?

**Q&A**

| Asked by        | Question                                     | Answer                                              |
| :-------------- | :------------------------------------------- | :-------------------------------------------------- |
| **Design**      | Should creator profiles differ from vendors? | Yes, include a “Highlight” tab for collections.     |
| **Engineering** | How to store curated lists?                  | Link collections to vendor catalog with creator ID. |

**Feature Timeline and Phasing**

| Feature                       | Status  | Sprint   | Dates         |
| :---------------------------- | :------ | :------- | :------------ |
| Creator profile upgrade       | Backlog | Sprint 2 | Oct 2–Oct 16  |
| Curated product lists         | Backlog | Sprint 2 | Oct 2–Oct 16  |
| Vendor–creator collaborations | Backlog | Sprint 3 | Oct 17–Oct 31 |
| Creator tab for discovery     | Backlog | Sprint 3 | Oct 17–Oct 31 |

**Creator Tools Flow**

1. **Guest Browsing / Attempted Engagement**
   - Users browse creators and collections without logging in.
   - Engagement actions (follow, save, message vendor) are blocked.
   - Expired/deleted products in collections are hidden; login/signup required.
2. **Upgrade to Creator**
   - Users log in/sign up via phone, email, or Google.
   - Navigate to profile → tap “Upgrade to Creator.”
   - Set bio, optional profile picture, link social accounts.
3. **Creator Dashboard**
   - Access tools: “Create Collection,” “Show Collaborations.”
4. **Curated Product List Creation**
   - Select vendor products → group into collection → publish.
5. **Collaboration Management**
   - Link vendor products → track engagement via backend.
   - Vendors tagged in collections.
6. **Buyer Interaction**
   - Logged-in buyers browse creator tab → follow creators → view collections.
   - Tap product → redirected to vendor listing.
7. **Expired / Deleted Product Handling**
   - Guest or logged-in user cannot engage with expired/deleted products.
   - Visual indicator for blocked items in collections.

**Acceptance Criteria**

- **Guest Browsing / View-Only Mode**
  - Users should be able to browse creator profiles and collections without logging in.
  - Users should be prevented from following, saving, or messaging vendors until login/signup.
  - Expired or deleted products should be hidden from guests; login required to view.
- **Login / Engagement**
  - Users should be able to log in or sign up via phone, email, or Google to engage with creators.
  - Logged-in users should be able to upgrade to Creator via profile settings.
- **Creator Tools**
  - Users should be able to create curated product lists (collections) using vendor products.
  - Users should be able to tag vendor products in collections for collaborations.
  - Users should be able to publish collections to followers.
- **Buyer Interaction**
  - Users should be able to follow creators and view curated collections.
  - Users should be able to tap products to navigate to vendor listings.
- **Expired / Deleted Products**
  - Users should be blocked from engaging with expired or deleted products.
  - Guests must log in to view expired/deleted items.
- **Error Handling & Edge Cases**
  - Users should see descriptive error messages when attempting blocked actions.
  - Guests should always be prompted to log in/sign up to engage.

---

## Admin Tools / Internal App

| Role                   | Name / Team               |
| :--------------------- | :------------------------ |
| **Product Manager**    | Fadeke Toba               |
| **Engineering Lead**   | Princewill (Technical)    |
| **Designer**           | Adebimpe (Design Team)    |
| **Approvers/Sign-Off** | Princewill, Product Owner |
| **Current Status:**    | **Backlog**               |

**Overview**
Admin Tools / Internal App empowers Chicly operations and support teams to manage vendors, moderate content, enforce rules, and track platform health. Guests and regular users cannot access admin functionality. Expired/deleted products, vendors, and reports are handled systematically. Admin tools ensure trust, governance, and operational efficiency during Beta and beyond.

**Problem**
Without admin visibility, Chicly risks fraud, fake products, poor content quality, and unresolved disputes. Instagram vendors already face credibility issues, so internal moderation and oversight are critical. Guest access must remain view-only, while login-required actions for support/admin functions ensure secure, traceable operations.

**Objectives**

1. Provide admins with a vendor management dashboard (approve, suspend, verify, reset).
2. Enable content moderation (products, reviews, profiles).
3. Support trust & safety by handling reports and disputes.
4. Equip internal teams with analytics dashboards to monitor platform growth.
5. Ensure role-based access control (admin, support, super-admin).
6. Enforce product expiration rules; expired listings hidden from guests and users.

**Constraints**

1. MVP scope: web-only internal tools.
2. Manual review workflow; limited automation in MVP.
3. Secure access control via RBAC.
4. Expired/deleted vendor or product records must be blocked from guest and unauthorized access.

**Persona**

| Key Persona                   | Description                                                        |
| :---------------------------- | :----------------------------------------------------------------- |
| **Admin (Ops, 25–35 yrs)**    | Monitors platform activity, approves vendors, suspends bad actors. |
| **Support Agent (22–30 yrs)** | Responds to reports and disputes, ensures safe engagement.         |

**Use Cases**

- **Scenario 1: Vendor Approval**
  Admin reviews vendor upgrade requests → approves/rejects based on documents.
- **Scenario 2: Product Moderation**
  Flagged product (e.g., fake designer item) appears in queue → admin removes or approves → vendor notified.
- **Scenario 3: Report Handling**
  Buyer reports vendor → support agent reviews order history → issues warning or resolves dispute.
- **Scenario 4: Analytics**
  Admin checks dashboard: “200 vendors onboarded, 1,200 products live, 50 reports handled this week.”
- **Scenario 5: Guest / User Restrictions**
  Guests cannot access admin dashboards or perform moderation; login required. Expired/deleted products blocked from view.

**Features In**

- Vendor management (approve, suspend, verify, reset).
- Product/content moderation (flag/remove products, reviews).
- Trust & safety dashboard (reports, disputes).
- Announcements (broadcast messages to vendors).
- Analytics dashboard (KPIs: vendors onboarded, active products, reports).
- Role-based access (admin, support, super-admin).
- Expired/deleted products blocked for guests and unauthorized users.

**Features Out**

- Automated fraud detection (future).
- Advanced analytics with custom queries.
- Bulk moderation scripts (future).

**Design (optional)**

- Web-based dashboard with sidebar: Vendors, Products, Reports, Analytics.
- List/table views with filters (date, vendor, report type).
- Expired/deleted items visually blocked or flagged.

**Technical Considerations**

- RBAC for secure access control.
- Separate secure login for admin/support.
- Audit logs for all actions.
- Integration with vendor/product DB.
- Expiration rules enforced for guest/user view.

**Success Metrics**

- ≥ 90% of vendor approval/review requests resolved within 48 hrs.
- ≥ 80% of flagged content addressed within 24 hrs.
- < 5% unresolved disputes after 7 days.
- 100% expired guest-visible products blocked.

**GTM Approach**

- Internal-only launch; no external messaging.
- Training session for Ops & Support prior to Beta launch.

**Open Issues**

- Should admin actions notify vendors automatically (e.g., suspension email)?
- Can individuals have multiple roles (admin + support)?

**Q&A**

| Asked by        | Question                                     | Answer                     |
| :-------------- | :------------------------------------------- | :------------------------- |
| **Ops**         | Can we bulk approve vendors?                 | No, MVP is manual.         |
| **Engineering** | Should admins log in with the same app auth? | No, separate secure login. |

**Feature Timeline and Phasing**

| Feature                  | Status  | Sprint   | Dates         |
| :----------------------- | :------ | :------- | :------------ |
| Vendor management        | Backlog | Sprint 5 | Nov 13–Nov 26 |
| Content moderation       | Backlog | Sprint 5 | Nov 13–Nov 26 |
| Reports/dispute handling | Backlog | Sprint 6 | Nov 27–Dec 10 |
| Analytics dashboard      | Backlog | Sprint 6 | Nov 27–Dec 10 |
| Role-based access        | Backlog | Sprint 6 | Nov 27–Dec 10 |

**Admin Tools Flow**

1. **Login / Secure Access**
   - Admin/support logs in via internal secure credentials.
   - RBAC determines permissions.
2. **Vendor Management**
   - Approve/reject vendor upgrade requests.
   - Suspend or reset vendor accounts.
3. **Content Moderation**
   - Flagged products/reviews appear in queue.
   - Admin removes or approves flagged content.
   - Expired/deleted products blocked from guest/user view.
4. **Reports / Disputes**
   - Buyer/vendor reports logged.
   - Support agent reviews → resolves or escalates.
5. **Analytics Dashboard**
   - View KPIs: vendors onboarded, active products, reports handled.
6. **Announcements**
   - Push broadcast messages to vendors.
   - Expired/deleted items excluded from announcements.

**Acceptance Criteria**

- **Admin / Support Access**
  - Users should be able to log in with secure credentials before accessing any admin or support functions.
  - Users should be able to perform actions according to their role (RBAC: admin, support, super-admin).
  - Users without proper privileges (guests or unprivileged accounts) should not be able to access internal tools.
- **Vendor Management**
  - Users should be able to approve, suspend, verify, or reset vendor accounts.
  - Users should be able to view required documentation for vendor upgrade requests.
  - Users should be able to block suspended vendors from all engagement, with optional notifications sent.
- **Content Moderation**
  - Users should be able to see flagged products, reviews, and profiles.
  - Users should be able to remove or approve flagged content.
  - Users should not see expired or deleted products when moderating content or in guest/user view.
- **Reports / Disputes**
  - Users should be able to view buyer/vendor reports and take necessary action.
  - Users should be able to log dispute outcomes, visible in the dashboard.
- **Analytics**
  - Users should be able to view accurate KPIs on vendors onboarded, active products, and reports handled.
  - Users should be able to track all admin actions in audit logs.
- **Announcements**
  - Users should be able to broadcast messages to vendors.
  - Users should not include expired/deleted products or vendors in broadcasts.
- **Error Handling & Edge Cases**
  - Users should be able to receive clear messages when attempting blocked actions.
  - Users should not be able to moderate, broadcast, or view expired/deleted items in active dashboards.

**Feature PRD Status Flow**

1. Backlog – Feature drafted and stored.
2. In Review – PM/Product Owner review.
3. Ready for Development – Approved with acceptance criteria.
4. In Progress – Development/design underway.
5. In QA / Testing – Functional & acceptance testing.
6. Completed – Deployed successfully.

---

## User Profile Management

| Role                   | Name / Team             |
| :--------------------- | :---------------------- |
| **Product Manager**    | Fadeke Toba             |
| **Engineering Lead**   | Princewill (Technical)  |
| **Designer**           | Adebimpe (Design Team)  |
| **Approvers/Sign-Off** | Adebimpe, Product Owner |
| **Current Status:**    | **Backlog**             |

**Overview**
User Profile Management allows buyers, vendors, and creators to manage their Chicly identity. Users can edit basic details, upload a profile picture, view activity (wishlist/favourites), and upgrade roles (e.g., Buyer → Vendor or Creator). Guests can browse products and creators but cannot save favourites, upgrade roles, or perform engagement actions. Expired products are hidden from guest/user view.

**Problem**
Instagram shopping lacks consistent user identity and trust signals. Buyers struggle to track preferences, vendors cannot easily upgrade, and creators lack visibility. Chicly needs centralized profiles that maintain trust (profile photo, bio, verification status) while keeping guest access view-only.

**Objectives**

1. Provide editable profile pages for all users.
2. Allow role upgrades: Buyer → Vendor, Buyer → Creator.
3. Display credibility markers: profile photo, verification badge, Trust Score for vendors.
4. Enable wishlist/favourites access via profile (login required).
5. Enforce guest restrictions: browsing only, engagement blocked.
6. Hide expired/deleted products from guest and user view.

**Constraints**

- Role upgrades lightweight; no heavy KYC in MVP.
- Profile images optimized for low bandwidth.
- Privacy/security features minimal at MVP.
- Product listings expire automatically; guests cannot engage or see expired content.

**Persona**

| Key Persona                                  | Description                                                        |
| :------------------------------------------- | :----------------------------------------------------------------- |
| **Buyer (22–30 yrs, mid-income)**            | Manage saved favourites and profile identity easily.               |
| **Vendor (25–35 yrs, small business owner)** | Needs credibility markers (photo, store link, verification badge). |
| **Creator (18–35 yrs)**                      | Wants profile visibility to attract collaborations.                |

**Use Cases**

- **Scenario 1: Guest Viewing**
  Ada browses creator/vendor profiles and product listings. Engagement actions (save, wishlist, upgrade, message) are blocked. Expired products automatically disappear.
- **Scenario 2: Profile Creation / Editing**
  The user signs up via phone, email, or Google → sets profile picture, name, bio → edits details later.
- **Scenario 3: Role Upgrade**
  Chinedu clicks “Upgrade to Vendor/Creator” in profile → completes required setup (store details or social links).
- **Scenario 4: Wishlist / Favourites Access**
  Users must be logged in to view and save wishlist/favourites.
- **Scenario 5: Vendor/Creator Trust Display**
  Vendor/creator profiles show verification tier and Trust Score to logged-in buyers.

**Features In**

- Editable profile: name, photo, bio.
- Role upgrades: Buyer → Vendor, Buyer → Creator.
- Wishlist/favourites section (login required).
- Vendor credibility markers: Trust Score badge, verification tier.
- Public profile view accessible to guests (view-only).
- Expired/deleted products blocked from guest and user view.

**Features Out**

- Advanced privacy settings (block/report users).
- Multi-profile accounts.
- Deep analytics or profile insights.

**Design (optional)**

- Profile page tabs: About | Wishlist | Store (if vendor).
- Inline edit button for profile updates.
- Public vs private profile view distinction.

**Technical Considerations**

- Role-based permissions tied to user accounts.
- Image compression for profile photos.
- Wishlist/favourites synced to profile DB.
- Trust Score algorithm integrated for vendor profiles.
- Expiration rules enforce visibility restrictions.

**Success Metrics**

- 80%+ of new users upload profile photos within 7 days.
- 70%+ of vendors upgrade via profile successfully.
- 60%+ of buyers revisit their wishlist within 14 days.
- 100% expired guest-visible products blocked.

**GTM Approach**

- Messaging: “Your Chicly identity, your store, your style.”
- Highlight role upgrade in onboarding and walkthrough.

**Open Issues**

- Should users hide their wishlist from public view at MVP?
- Should creators’ profiles be separate from vendors at launch?

**Q&A**

| Asked by        | Question                            | Answer                                        |
| :-------------- | :---------------------------------- | :-------------------------------------------- |
| **Design**      | Show wishlist on profile or hide?   | Showing it; helps engagement.                 |
| **Engineering** | Support multiple roles per account? | No; MVP allows single role with upgrade path. |

**Feature Timeline and Phasing**

| Feature                    | Status  | Sprint   | Dates         |
| :------------------------- | :------ | :------- | :------------ |
| Profile editing            | Backlog | Sprint 2 | Oct 2–Oct 15  |
| Role upgrade               | Backlog | Sprint 3 | Oct 16–Oct 29 |
| Wishlist section           | Backlog | Sprint 3 | Oct 16–Oct 29 |
| Vendor credibility markers | Backlog | Sprint 3 | Oct 16–Oct 29 |

**User Profile Management Flow**

1. **Guest Browsing**
   - Users browse products, creators, and vendors without logging in.
   - Engagement actions blocked (wishlist, save, upgrade, message).
   - Expired/deleted products hidden automatically.
2. **Sign Up / Login (Phone, Email, Google)**
   - Prompted when attempting to engage (save, wishlist, role upgrade).
   - OTP/email verification ensures secure account creation.
3. **Profile Creation / Edit**
   - Upload profile photo, set name, bio.
   - Edit profile at any time (inline).
4. **Role Upgrade**
   - Tap “Upgrade” → start vendor or creator flow.
   - Add store details or social accounts.
5. **Wishlist / Favourites**
   - Logged-in users access saved products in profile.
6. **Vendor/Creator Trust Display**
   - Verification tier + Trust Score visible to logged-in buyers.

**Acceptance Criteria**

- **Guest Browsing (View-Only)**
  - Users should be able to view profiles, products, creators, and vendors without logging in.
  - Users should not be able to perform engagement actions such as wishlist, save, message, or upgrade while browsing as a guest.
  - Users should not see expired or deleted products during guest browsing.
- **Signup / Account Creation**
  - Users should be able to sign up using a phone number, email, or Google account.
  - Users should be able to complete OTP/email verification to finalize account creation.
  - Users should be able to create their profile in two steps or fewer.
- **Profile Editing**
  - Users should be able to edit their name, bio, and profile photo.
  - Users should be able to save profile changes instantly.
- **Role Upgrade**
  - Users should start with a default role of Buyer.
  - Users should be able to upgrade from Buyer to Vendor or Creator via profile settings.
  - Users upgrading to Vendor should be able to provide store details during the upgrade.
  - Users upgrading to Creator should be able to link social accounts and set up content during the upgrade.
- **Wishlist / Favourites**
  - Users should be able to save products to their wishlist only after logging in.
  - Users should be able to view saved wishlist/favourites only when logged in.
  - Users should not see expired or deleted products in their wishlist.
- **Vendor / Creator Trust Display**
  - Users should be able to see Trust Score badges on vendor and creator profiles.
  - Users should be able to see verification tiers displayed accurately on profiles.
- **Error Handling / Edge Cases**
  - Users should receive clear messages when attempting actions that are blocked for guests or restricted users.
  - Users should not be able to save, view, or interact with expired/deleted items in wishlist or public profiles.

**Feature PRD Status Flow**

1. Backlog – Drafted and stored.
2. In Review – PM/Product Owner review.
3. Ready for Development – Approved with acceptance criteria.
4. In Progress – Development/design underway.
5. In QA / Testing – Functional & acceptance testing.
6. Completed – Feature passes all criteria and deployed.

---

# Chicly Overview

## NorthStar

### Chicly Executive Summary

**Chicly: A Trusted Space for Women to Shop, Create, and Grow Together**
**Slogan:** Built for Her—Shop, Share, Succeed.

**What is Chicly:** Chicly is a trusted social commerce platform empowering women to shop authentic lifestyle, beauty, and fashion, create content, and grow in a supportive community. With KYC-verified vendors, escrow-protected transactions, and nano-creator tools, it ensures scam-free, confident purchases and authentic connections. Chicly is meant to deliver 80% faster transactions and 60% higher satisfaction, redefining social commerce for women’s empowerment. Join at chicly.com!

**Vision:** To lead global social commerce by empowering every woman to express her authentic self through seamless discovery, confident purchases, and collaborative growth in beauty and lifestyle.

**Mission:** Chicly is the trusted lifestyle platform where women shop authentic beauty and fashion, create meaningful connections, and grow together in a supportive community.

**The Problem:** Millions of women in Nigeria and beyond navigate chaotic social commerce on platforms like Instagram and TikTok, facing scams, fake products, and endless haggling that erode trust and confidence. Over 40% abandon carts due to these issues, wasting time and stifling self-expression through beauty and lifestyle purchases.

**The Solution:** Chicly transforms social commerce into a safe, empowering space. With KYC-verified vendors, escrow-protected transactions, real-time reviews, and tools for nano-creators, Chicly ensures confident shopping and authentic connections. Beta tests show 5,000 users enjoying 80% faster transactions and 60% higher satisfaction, with 1,200 women monetizing content in vibrant community networks.

**Brand Pillars:**

- **Trust & Safety:** KYC, badge tiers, escrow, and verified reviews eliminate scams.
- **Discovery:** Curated feeds and smart search spark seamless inspiration.
- **Creation:** Nano-creator tools and campaign briefs drive authentic content.
- **Community:** Follows, lists, and events foster supportive connections.
- **Growth:** Analytics and education hubs empower sellers and creators.

**Core Values (Chicly ACTs):** Authenticity, Community, Trust—prioritizing scam-free spaces, women-led empowerment, honest interactions, style-driven confidence, and collective growth.

**Objectives:**

- **Short-Term (1-2 Years):** Onboard 50,000 verified users, achieve ₦500M GMV and Revenue ₦300M, and host 50 community events for 5,000+ participants.
- **Medium-Term (3-5 Years):** Scale to 1M global users, enable 10,000 women to monetize content, and capture 25% African market share.
- **Long-Term (5-10 Years):** Serve 50M users across 50 countries, lead industry trust standards, and support 500,000 women in economic growth.

Chicly is poised to redefine social commerce, empowering women worldwide to shop, create, and thrive together. Join at chicly.com to start your journey.

---

## Metrics & Runway Tracker

### App

Tracks core platform activity to ensure trust and seamless shopping.

| Metric                                    | Definition                                             | Target                                                      | Owner        | Formula/Notes                                                                                               |
| :---------------------------------------- | :----------------------------------------------------- | :---------------------------------------------------------- | :----------- | :---------------------------------------------------------------------------------------------------------- |
| **Weekly Content Creator Booking Growth** | Completed transactions (purchases, creator hires)      | 5–7% WoW growth                                             | Product Lead | (Current / Prior Week - 1) × 100; Monday sync                                                               |
| **Vendor Onboarding Rate**                | % of vendor sign-ups that complete KYC/verification    | 80%                                                         | Product Lead | (Verified Vendors / Total Sign-Ups) × 100; Ties to Trust pillar                                             |
| **Match Rate (Liquidity)**                | % of buyer inquiries leading to transactions           | >50%                                                        | Product Lead | (Successful Matches / Total Inquiries) × 100; Measures marketplace efficiency                               |
| **Time to Match**                         | Avg. time from inquiry to transaction completion       | <24 hours                                                   | Product Lead | Avg. (Transaction Time - Inquiry Time); Reduces DM friction                                                 |
| **GMV per Week**                          | Total value of beauty/fashion sales, gigs              | ₦10M by Q1 2026                                             | Finance Lead | Value of transactions (excl. refunds)                                                                       |
| **Number of DMs Buyers Use**              | Average DMs per buyer to complete a vendor transaction | >10 per transaction (baseline high); monitor for efficiency | Product Lead | (Total DMs / Total Transactions); High volume expected as key communication channel for off-platform closes |
| **Take Rate**                             | % of rate charges on escrow commission                 | 20% per transaction                                         | Product Lead |                                                                                                             |

### Community & Empowerment

Measures engagement and economic growth for women, fostering creation and community.

| Metric                        | Definition                                              | Target | Owner             | Formula/Notes                      |
| :---------------------------- | :------------------------------------------------------ | :----- | :---------------- | :--------------------------------- |
| **Community Engagement Rate** | % of active users interacting (likes, shares, comments) | 2%     | Marketing Lead    | (Engagements / MAU) × 100          |
| **Retention Rate**            | % of female users returning weekly/monthly              | 30%    | Product Lead      | (Returning / Total Users) × 100    |
| **Creator Monetization Rate** | % of nano-creators earning via gigs                     | 10%    | Community Manager | (Monetized / Total Creators) × 100 |

### Financial Sustainability

Ensures viability to scale trust and empowerment globally.

| Metric                  | Definition                                      | Target      | Owner          | Formula/Notes                       |
| :---------------------- | :---------------------------------------------- | :---------- | :------------- | :---------------------------------- |
| **Burn Rate (Monthly)** | Net cash outflow                                | < ₦5M/month | Finance Lead   | Expenses - Revenue                  |
| **Runway (Months)**     | Cash reserves / Burn Rate (Equity/contribution) | 12+ months  | Founder        | Cash / Monthly Burn                 |
| **CAC Payback Period**  | Months to recover CAC                           | < 6 months  | Marketing Lead | CAC / Avg. Monthly Revenue per User |

**Cadence:** Update weekly in Google Sheets/Notion; visualize trends (line charts). Review Monday; aim for 70–80% target achievement. Adjust via Customer Learning Log if growth stalls (<5%).

**Appendix:**

- **Burn Rate:** This is the rate at which Chicly organization is spending funds available to it.
- **Runway:** This is the timeline between when Chicly had funds till when it would run out of cash.
- **CAC:** Customer acquisition cost; The cost of onboarding a single user to come and use chicly’s application and transact.
- **GMV:** Gross Merchandise Value. This is not Chicly’s money but the total value of goods and services within the chicly community.
- **MAU:** Monthly Active Users

---

## Customer Logs

| Date         | Source                           | Key Insight                                                                                                                            | Hypothesis Tested (Assumption + Result)                                                                 | Patterns/Impact                                                                                                                         | Actions/Pivots                                                                                                                                        |
| :----------- | :------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sep 07, 2025 | Cela Naturals Interview (Vendor) | Time-consuming consultations frustrate vendors; buyers ghost after advice. Pricing comparisons lead to lost deals.                     | "Verified badges reduce buyer drop-off after consultations" – Untested; baseline drop-off 50% from DMs. | High DM volume (>10/transaction) signals trust gaps; 40% cart abandonment due to scams. Impacts retention (target 30%).                 | Prioritize KYC badges in MVP; A/B test in-app consultation tools; Pivot: Add pricing transparency calculator to reduce haggling. Owner: Product Lead. |
| Sep 07, 2025 | Aniks Interview (Vendor)         | Referrals via WhatsApp drive most sales; trust issues from price comparisons cause lost deals. No ads run yet due to time constraints. | "Community referrals boost conversion 20%" – Validated; 25% of sales from returning customers.          | Role upgrades (buyer to vendor) needed seamlessly; low TikTok adoption due to complexity. Influences acquisition rate (target 10% WoW). | Add an influencer collaboration hub for easier marketing. Owner: Marketing Lead.                                                                      |
| [Add Row]    | [e.g., Beta User Survey]         | [e.g., Women value authentic reviews over ads]                                                                                         | [e.g., "Reviews increase repeat purchases by 25%" – Tested via A/B]                                     | [e.g., Pattern: 60% higher satisfaction with verified vendors]                                                                          | [e.g., Roll out review moderation; Owner: Community Manager]                                                                                          |

---

## USER PERSONA

### PRIMARY AUDIENCE: Buyers

**Who they are:**

- Women aged 18-40, active online shoppers
- Live primarily in urban & semi-urban Nigeria (we’ll focus on Lagos, Port-harcourt and Abuja)
- Cautious about online transactions due to scam trauma, but still want convenience
- Crave safer, more trusted ways to find female owned brands
- Love a good vibe, aesthetics, and real stories. Avoid hard sell/desperate vibes

**Where they hang out:**

- Instagram, WhatsApp groups, TikTok, Pinterest
- Twitter for banter, threads. They catch up on hot takes
- Facebook Groups (older segment)

**How they think:**

- I want to support women, but I also need peace of mind.
- I’m tired of getting played. I want receipts, reviews, and referrals.
- If this works for other girls/women like me, I’m in.

**What they value:**

- Relatability, transparency, and low pressure recommendations
- Verified businesses, but with personality, not corporate vibes
- Real time content (polls, drops, reviews)

### SECONDARY AUDIENCE: vendors

**Who they are:**

- Women aged 21-45, building personal brands or online stores
- Sell via Instagram, WhatsApp, and TikTok shops
- Often under recognized due to small size or limited exposure
- Want to grow, but feel overlooked by traditional platforms and paid ads

**What they need:**

- A community badge of trust that sets them apart
- A place to collaborate, grow visibility, and make real sales
- Help getting their content seen by people who actually convert

**What they say:**

- "I just want people to know I'm legit."
- "Influencer collabs are too expensive and risky."
- "I want to grow, but I don't know who to trust."
- "Some people come across my page and assume we are not legit because we have a small follower count"

### TERTIARY AUDIENCE

**Who they are:**

- Female content creators with 1k-10k followers, mostly lifestyle, beauty, fashion.
- Struggling to monetize consistently.
- Often overlooked because they don’t have huge numbers, but have engaged, loyal followers i.e communities
- Want brand collabs they can be proud of, not scam DMs or “freebie deals”

**Where they’re active:**

- Instagram (Reels + Stories), TikTok, YouTube Shorts
- Some also manage personal WhatsApp or Telegram channels
- Twitter for vibes + content recycling
- Pinterest for Content Inspiration

**What they value:**

- Brands that see their worth without playing the numbers game
- Safe, clear collaborations that actually pay
- Being celebrated, not just used. they want community too

**How they think:**

- “I know my content slaps. I just need the right brand to notice me.”
- “I am tired of receiving scam emails from supposed big brands, I want the real deal”
- “I don’t want to beg for partnerships. I just want them to see my passion and value”

---

## Operating System

Chicly’s Operating System (OS) defines how the company works on a day-to-day basis—covering roles, decision-making, processes, tools, and principles that guide execution. It is designed to ensure alignment across the team, reduce friction in decision-making, and keep us accountable to our growth goals.

The OS provides clarity in four key areas:

1. **Roles & Responsibilities** – Each role is clearly defined with ownership of specific metrics and reporting lines (see Role Matrix). This ensures accountability and prevents overlap.
2. **Decision Rights** – A transparent framework that outlines who decides what and how decisions are made (e.g., feature prioritization, pricing, partnerships). This minimizes delays and empowers team members to act quickly within their authority.
3. **Ways of Working** – Sprint planning, weekly cadences, tools, and communication norms that govern how the team collaborates. This includes Agile sprints, code review processes, standups, and community syncs.
4. **Operating Principles** – Core values and guiding behaviors (e.g., Trust First, Authentic Always, Iterate Fast). These principles shape every product and team decision.

### ROLE MATRIX

| Role                  | Responsibilities                                                                         | Key Metrics Owned                                                                 | Reports To   |
| :-------------------- | :--------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- | :----------- |
| **Founder/CEO**       | Vision, fundraising, overall strategy; Approves major pivots (e.g., global expansion)    | Runway (12+ months), Revenue Growth (5–7% WoW)                                    | N/A          |
| **Product Lead**      | MVP features, user flows (e.g., vendor onboarding, KYC); Role upgrades (buyer to vendor) | Weekly Bookings Growth (5–7%), Retention Rate (30%), Vendor Onboarding Rate (80%) | Founder      |
| **Finance Lead**      | Financial tracking, commissions (20% take rate); Burn/runway management                  | GMV per Week (₦10M by Q1 2026), Burn Rate (<₦5M/month), CAC Payback (<6 months)   | Founder      |
| **Marketing Lead**    | User acquisition, community events; Notifications for role upgrades                      | User Acquisition Rate (10% WoW), Community Engagement (2%), CAC                   | Founder      |
| **Community Manager** | Creator tools, events (50 in Year 1); Support for growth (e.g., monetization)            | Creator Monetization Rate (10%), Repeat Purchase Rate (25%), NPS (>50)            | Product Lead |

### Decision Rights Matrix

| Decision Area                                      | Who Decides       | Input From                 | Approval Threshold                              |
| :------------------------------------------------- | :---------------- | :------------------------- | :---------------------------------------------- |
| **Feature Prioritization (e.g., in-app DM tools)** | Product Lead      | All team                   | Founder for MVP changes                         |
| **Pricing/Commissions (e.g., 20% take rate)**      | Finance Lead      | Marketing, Product         | Founder if >10% change                          |
| **Community Events/Challenges**                    | Community Manager | Marketing                  | Product Lead for budget >₦1M                    |
| **Vendor KYC Approvals**                           | Product Lead      | Finance (for fraud checks) | Auto-approve if compliant; Founder for disputes |
| **Fundraising/Partnerships**                       | Founder           | All team                   | Team vote for major deals                       |

### Weekly Cadence

| Days          | Session                                         | Time     | Owner          |
| :------------ | :---------------------------------------------- | :------- | :------------- |
| **Monday**    | Standup                                         | 6pm EST  | Fadeke         |
| **Tuesday**   | Marketing                                       | 11AM EST | Sophia         |
| **Wednesday** | Standup                                         | 6PM EST  | Fadeke         |
| **Thursday**  | Strategy session: Presentation of work Progress | 6PM EST  | Ade and Fadeke |
| **Friday**    | Marketing                                       | 11AM EST | Sophia         |

### How We Work

**Tech Stack & Workflows**

- **Core Tools:** App built on React Native (mobile-first for IG/TikTok integration); Backend: Node.js/Express; Database: MongoDB for user data; Payments: Paystack/Flutterwave for escrow (20% commission). KYC: Integrate with BVN/NIN APIs for verification.
- **Development Workflow:** Agile sprints (2-week cycles); Code reviews via GitHub (2 approvals needed); Deploy: CI/CD with Vercel (dev/staging/prod); On-call: Founder/Product Lead for incidents (SLA: <1 hour response).
- **Onboarding Workflow:** All start as buyers; Upgrade via profile/notification → KYC wizard → Vendor dashboard (toggle roles seamlessly).
- **Comms Norms:** Whatsapp for async (channels: #general, #product, #marketing); WhatsApp for urgent; Weekly sync Monday 9 AM EST | (30 min: metrics review); Decisions via shortest path (no hierarchy); Response time: <24 hours.

### Core Operating Principles

- **Trust First:** Every feature prioritizes safety (e.g., badges before launches).
- **Women for Women:** Design for empowerment—test with female users weekly.
- **Authentic Always:** Promote genuine content; no fakes (e.g., AI moderation for reviews).
- **Growth Together:** Celebrate wins collectively; share learnings in log.
- **Iterate Fast:** Delete unnecessary processes (Musk-inspired); pivot if metrics stall <5% growth.

**Cadence:** Review full OS quarterly; assign owners for updates. Tools: Notion for doc storage.

---

## IN-PROGRESS

### ACCOUNT CREATION PROCESS

**Journey Map:**

1. Everyone join in as buyers
2. Then they can either choose to upgrade their account to be a vendor
3. OR They can also both choose to be a nano-influencer and upgrade their account

**InApp Process**

- BUYER ACCOUNT CREATION PROCESS
- VENDOR ACCOUNT CREATION PROCESS
- NANO-INFLUENCER ACCOUNT CREATION PROCESS
- BUYER VERIFICATION PROCESS
- NANO-INFLUENCER VERIFICATION PROCESS

| Step  | Action / Description                                                                                                                                              | Owner                                 | Timeline | Notes / Deliverables                                                 |
| :---- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------ | :------- | :------------------------------------------------------------------- |
| **1** | **Form Submission** – Influencer completes the Google Form with personal info, social handles, follower count, past collaborations, values, and brand preferences | Influencer                            | Day 0    | Auto-capture responses via Google Sheets linked to Form              |
| **2** | **Automated Confirmation Email** – “Thanks for signing up! Here’s what happens next…”                                                                             | Marketing / Community Team            | Day 0–1  | Email includes next steps, estimated timeline, and community intro   |
| **3** | **Initial Review of Responses** – Check influencer fit: follower count, platform relevance, content quality, alignment with Chicly brand values                   | Community Manager                     | Day 1–2  | Flag high-potential influencers for interview                        |
| **4** | **Interview / Onboarding Call** – Short video or phone call to understand motivations, content style, and clarify expectations                                    | Community Manager / Partnerships Lead | Day 2–5  | Scripted questions; record notes in Google Sheet                     |
| **5** | **Guide Sharing** – Send “Nano is the New Chic” onboarding guide, including tips, community rules, and collaboration expectations                                 | Community Manager                     | Day 2–5  | Include link to guide PDF or Google Doc; ensure read receipt         |
| **6** | **Add to WhatsApp Community** – Introduce influencer to WhatsApp group for collaboration updates and networking                                                   | Community Manager                     | Day 3–6  | Post welcome message                                                 |
| **7** | **Ready for Collaborations** – Influencer profile marked as “active” and available for campaigns                                                                  | Community Manager                     | Day 5–7  | Track in internal dashboard; monitor first collaboration performance |

### Buyer Onboarding Process – Detailed Steps, Owners & Timeline

| Step  | Action / Description                                                                                          | Owner                      | Timeline | Notes / Deliverables                                             |
| :---- | :------------------------------------------------------------------------------------------------------------ | :------------------------- | :------- | :--------------------------------------------------------------- |
| **1** | **Form Submission** – Buyer completes Google Form capturing: Name, Email, WhatsApp Number                     | Buyer                      | Day 0    | Auto-capture responses via Google Sheets linked to Form          |
| **2** | **Automated Confirmation Email** – “Thanks for joining Chicly! Here’s what’s next…”                           | Marketing / Community Team | Day 0–1  | Includes welcome message and community guidelines                |
| **3** | **Add to WhatsApp Community** – Buyer added to WhatsApp group for updates, deals, and engagement              | Community Manager          | Day 0–1  | Welcome message posted; group rules shared                       |
| **4** | **Email Subscription / CRM Update** – Buyer’s email added to newsletter or email campaigns                    | Marketing / CRM Lead       | Day 0–1  | Ensures they receive future updates, promotions, and newsletters |
| **5** | **Active Community Member** – Buyer now fully integrated and able to engage with posts, promotions, and chats |                            |          |                                                                  |

---

## Documentations

| SN               | Document Name                    | Date Added    | Document Link                                                       | Created By | BUSINESS UNIT |
| :--------------- | :------------------------------- | :------------ | :------------------------------------------------------------------ | :--------- | :------------ |
| **1.**           | Business Model                   |               |                                                                     |            |               |
| **2.**           | Pricing Model                    |               |                                                                     |            |               |
| **3.**           | Badge system                     |               | Vendor Badge System                                                 | Fadeke     |               |
| **4.**           | Whatsapp Onboarding              |               | Vendor Onboarding Process – Detailed Steps, Owners & Timelines.docx |            |               |
| **PRODUCT TEAM** |                                  |               |                                                                     |            |               |
| **1**            | PRD                              | Sep 12,2025   | PRD 3.0 Chicly Feature PRD Library                                  | Fadeke     |               |
| **2**            | App Flows                        |               | App Flows                                                           | Adebimpe   |               |
| **3**            | Technical Specification Document |               |                                                                     |            |               |
| **4**            | InApp Onboarding                 |               |                                                                     |            |               |
| **5**            | Product Strategy                 | Sept 12,2025  | Product strategy                                                    | Fadeke     |               |
| **6**            | Vendor Analysis Report           | Sept 12,2025  | Vendor Analysis                                                     | Fadeke     |               |
| **7**            | Product criteria                 | Sept 14, 2025 | Product Criteria                                                    | Fadeke     |               |
| **8**            | Feature List                     | Sept 15, 2025 | Feature list                                                        | Fadeke/Ade |               |

---

## Chicly Product Roadmap

This one-page roadmap outlines phased development for Chicly, aligning with our vision (global social commerce leadership for women’s authentic beauty/lifestyle expression) and mission (trusted platform for shopping, creating, growing together).

**Phases:** MVP (Build Foundations) → Beta (Test & Iterate) → Launch (Scale Growth) → Future (Global Expansion).

**Roadmap Overview**

- **Timeframe:** Q4 2025 – Q4 2026 (adjust based on runway: 12+ months)
- **Key Themes:** Trust & Safety first → Discovery/Creation → Community/Growth
- **Review:** Bi-weekly in sprints; update post-metrics sync (Monday 6 PM EDT)
- **Success Metric:** 70–80% milestone hit; adjust based on runway (<₦5M burn)

| Phase (MVP)                                                                                                     | Key Features / Milestones                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Risks & Mitigations                                                                                                                                         |
| :-------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **MVP Build Foundations (Sprint-Level) Q4 2025 (Sept–Dec)**                                                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                             |
| **Sprint 1 (Sept 18–Oct 1)**`<br>`Owners:`<br>`Product Lead: Adebimpe Omolaso`<br>`Engineering Lead: Princewill | _Estimate MVP Delivery`<br>`_ Set up Deployment like AWS/CI-CD, build core APIs (auth, users, vendors, catalog).`<br>`_Core backend setup: cloud infra, authentication, user/vendor profiles, product catalog, database schema. Initial unit tests.`<br>`_ Create Information Architecture of the Web Admin App`<br>`_Create Information Architecture of the mobile App.`<br>`_ Core User flows`<br>`1. Onboarding for and authentication and product catalog. 2. Escrow payouts/Dispute and creator marketplace 3. Product feed and 5.Profile`<br>`_Design system setup`<br>`_ Wireframe & Prototype | Tech delays → Phase APIs tightly; mitigate with early backend readiness. Pilot with 10 vendors before launch.                                               |
| **Sprint 2 (Oct 2–15)**`<br>`Back end services/wire frames                                                      | _Secondary mobile Ui flows e.g WhatsApp redirect, notifications, ratings/reviews. Vendor dashboard API and analytics logging.`<br>`_ Product Ratings/badges`<br>`_Core services (WhatsApp redirect, notifications, reviews), vendor dashboard API, basic analytics logging. And wireframes.`<br>`_ Wireframes, app flows, and early user journeys. To guide frontend work.`<br>`\* Build Admin Web App for monitoring and approval of vendors.                                                                                                                                                        | Misalignment between backend and design progress`<br>`Incomplete wireframes delaying frontend kickoff`<br>`Parallel work streams causing communication gaps |
| **Sprint 3 (Oct 16–29)**`<br>`Front End Foundations                                                             | UI handoff, build React Native app (onboarding, login, discovery feed, vendor profiles), Recommendation engine, integrate APIs.`<br>`React Native setup, onboarding & login screens, auth API integration. Designers provide ongoing asset delivery.                                                                                                                                                                                                                                                                                                                                                  | Dependency on finalized APIs`<br>`Risk of unstable builds during early frontend setup`<br>`Delayed design handoff blocking development                      |
| **Sprint 4 (Oct 30 – Nov.12)**`<br>`Front End MVP                                                               | Full integration, image upload, save/repost, internal QA, bug fixes.`<br>`Discovery Feed & Vendor Profiles. Vendor/product API integration. Designers support QA and polish                                                                                                                                                                                                                                                                                                                                                                                                                           | Feature creep risk`<br>`Integration bugs between frontend and backend`<br>`UI/UX inconsistencies across devices                                             |
| **Sprint 5 (Nov 13- 26)**`<br>`Feature Expansion                                                                | Save/repost, review UI, vendor dashboard expansion. Designers refine visuals.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Overlap with unfinished MVP tasks`<br>`Vendor dashboard complexity may slow delivery`<br>`Risk of design refinements coming in late                         |
| **Sprint 6 (Nov 27-Dec.10)**`<br>`Integration & QA                                                              | Full integration, internal alpha, bug fixes, performance optimization. Visual QA included.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | High volume of bugs during alpha testing`<br>`Performance bottlenecks under load`<br>`Limited test coverage before beta launch                              |
| **Beta Launch (Dec 11–20)**                                                                                     | Play Store submission, go-live with 20 vendors.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                             |
| **Q1–Q2 2026 (6 months)**                                                                                       | _Recommendation engine`<br>`_ Boosted marketplace`<br>`_Revision manager`<br>`_ Creator calendar`<br>`_Multi-role teams`<br>`_ API integrations`<br>`\* Nigeria-first beta cohorts                                                                                                                                                                                                                                                                                                                                                                                                                    | Low adoption → A/B test notifications; adjust features if DMs >15 per transaction.                                                                          |
| **Launch: Scale Growth**                                                                                        | Public launch: full search/ranking`<br>`Education hub`<br>`Influencer tools`<br>`Analytics v1`<br>`Expansion into IG/TikTok/WhatsApp                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Market saturation → Partner with 200 nano-creators; enforce dispute rate <5%.                                                                               |
| **Future: Global Expansion**                                                                                    | International localization`<br>`Advanced AI discovery`<br>`Philanthropy arm (5% of revenue to women’s initiatives)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Regulatory hurdles → Build compliance buffer; quarterly audits.                                                                                             |

---

## Business Model

Detail how the company creates, delivers, and captures value. This section uses a Business Model Canvas-inspired structure to provide a clear, visual overview. Tie it back to the vision, mission, and metrics for alignment. Customize with industry-specific examples.

- **Value Proposition:** A trusted social commerce platform providing safety, efficiency, and community for women to shop, create, and grow. Differentiators: KYC-verified vendors, escrow protection, nano-creator tools, and a supportive community.
- **Customer Segments:**
  - **Primary:** End-users/Buyers – Women aged 18-40 in Nigeria, cautious about online scams but seeking convenience and community.
  - **Secondary:** Sellers/Vendors – Women aged 21-45 building online stores, seeking trust and visibility.
  - **Tertiary:** Creators/Partners – Female content creators (1k-10k followers) seeking monetization and authentic brand collaborations.
- **Channels:**
  - **Acquisition:** Social media (Instagram, TikTok, WhatsApp), community referrals, influencer marketing.
  - **Delivery:** Mobile app (Android & iOS).
- **Customer Relationships:**
  - Self-service via the app.
  - Community support through events, WhatsApp groups, and forums.
  - Personalized via analytics and targeted notifications.
- **Revenue Streams:**
  - **Transaction fees/commission (20%)** on all sales and creator gigs through escrow.
  - **Premium subscriptions** for advanced vendor/creator tools (Future).
  - **Advertising or partnerships** (Future).
  - **Projections:** Achieve ₦300M revenue in 1-2 years.
- **Key Resources:**
  - **Technology:** React Native mobile app, Node.js backend, MongoDB, Paystack/Flutterwave integration.
  - **Human:** Core team (Founder, Product, Finance, Marketing, Community).
  - **Intellectual:** User data, community engagement insights, brand trust.
  - **Financial:** Runway of 12+ months.
- **Key Activities:**
  - **Product development:** Building and iterating on the mobile app features.
  - **Marketing:** User acquisition and brand building.
  - **Community management:** Fostering engagement and support.
  - **Compliance:** KYC verification and trust & safety monitoring.
- **Key Partnerships:**
  - **Payment providers:** Paystack/Flutterwave.
  - **Influencers/creators:** For marketing and content creation.
  - **Vendors:** The core of the marketplace.
  - **Regulatory bodies:** For compliance.
- **Cost Structure:**
  - **Fixed:** Salaries, tech infrastructure.
  - **Variable:** Marketing (CAC), transaction processing fees.
  - **Targets:** Maintain burn rate under ₦5M/month; Achieve CAC payback in < 6 months.

**Sustainability Notes:** Focus on network effects to drive scalability. Monitor retention and monetization rates closely. Pivot based on customer logs and feedback.

**Cadence:** Review quarterly with finance lead. Update post-fundraising or major pivots.
