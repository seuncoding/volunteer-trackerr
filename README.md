# Volunteer Tracker

A web app for managing volunteers, tracking attendance, and running event day check-ins.

## Features

- **Roster Management** - Add, edit, and delete volunteers with name, email, phone, and roles
- **Status Tracking** - Track volunteer status (pending, confirmed, attended, no-show)
- **Event Check-in** - Quick check-in system for event day with timestamp tracking
- **Search & Filter** - Find volunteers by name, email, or status
- **Persistent Storage** - Data saved in browser's local storage

## Deploy to Vercel

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in (or create an account)
2. Click **New repository**
3. Name it `volunteer-tracker`
4. Click **Create repository**

### Step 2: Upload Files to GitHub

After creating the repo, GitHub will show you commands. Follow these steps in your terminal:

```bash
cd /path/to/volunteer-tracker
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/volunteer-tracker.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign up** (or sign in if you have an account)
3. Click **Continue with GitHub** and authorize Vercel
4. Click **New Project**
5. Find your `volunteer-tracker` repository and click **Import**
6. Click **Deploy**

That's it! Vercel will automatically deploy your app. You'll get a live URL like:
```
https://volunteer-tracker-xyz123.vercel.app
```

### Step 4: Share Your Link

You can now share this URL with anyone who needs to access the volunteer tracker!

## Local Development

To run locally:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Data Storage

All volunteer data is stored in your browser's local storage. This means:
- Data persists between sessions
- Each browser/device has its own data
- Data is never sent to a server
- Clearing browser data will delete everything

To back up your data, you could export it as JSON and import it later.

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)
