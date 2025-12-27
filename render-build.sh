#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "--- Installing Server Dependencies ---"
cd server
npm install

echo "--- Installing Client Dependencies ---"
cd ../client
# Force install devDependencies (needed for Vite build) even if NODE_ENV=production
npm install --include=dev

echo "--- Building Client ---"
npm run build

echo "--- Build Complete ---"
