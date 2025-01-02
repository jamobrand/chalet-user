# Atomik OCC

<img src="./src/assets/Kenya-Railways-Logo.png" alt="Kenya Railways Logo" width="200"/>

Atomik Dashboard is a web application built using Vite, React, and TypeScript.

## Prerequisites

Before running the app, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18.x or higher)
- [npm](https://www.npmjs.com/)

## Installation

To get started, clone the repository and install the dependencies.

```bash
git clone https://github.com/Vasmobile-Fintelco-Ltd/atomik-occ.git
cd atomik-occ

# Install dependencies
npm install

# Start Application 
npm run dev

# Run app in docker 
To run the app in docker do the following

# Get the version first 
VERSION=$(node -p "require('./package.json').version")

# Build Docker Image 
docker build -t atomik/atomik-occ:$VERSION .

# Run Docker Image 
docker run -d -p 6450:6450 --name atomik-occ atomik/atomik-occ:$VERSION
