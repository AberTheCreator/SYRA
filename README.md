# SYRA - Micro-Tipping Platform on Stacks Blockchain


**SYRA** is a revolutionary micro-tipping platform built on the Stacks blockchain, leveraging Turnkey's embedded wallet SDK for seamless, non-custodial wallet management. Support your favorite creators with sBTC tips, earn dynamic NFT rewards, and engage in a vibrant community.

## 🚀 Features

### Core Functionality
- **Embedded Wallet Integration**: Connect via email, passkeys, or OAuth with Turnkey's SDK
- **Micro-Tipping**: Send sBTC tips starting from 0.001 sBTC
- **Creator Profiles**: Discover and support creators with transparent tip tracking
- **NFT Rewards**: Earn dynamic NFTs that evolve based on your support level
- **Recurring Tips**: Schedule automatic tips (daily, weekly, monthly)
- **Tip Splitting**: Automatically split tips among multiple collaborators
- **Gamification**: Compete on leaderboards and unlock achievement badges
- **Content Unlocking**: Access premium content through tip thresholds

### Technical Highlights
- Built with React 18 and Vite
- State management with Zustand
- Stacks blockchain integration
- Turnkey embedded wallet SDK
- Tailwind CSS for modern UI
- Netlify serverless functions
- Clarity smart contracts

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Quick Start
```bash
# Clone the repository
git clone https://github.com/aberthecreator/syra-platform.git
cd syra-platform

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables
# Edit .env with your API keys and configuration

# Start development server
npm run dev
