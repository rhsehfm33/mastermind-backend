## About project

### What is this project?
This project provides schedule management system similar to 'Kanban'.</br>
First, You have to sign up account and login to use this application.</br>
After that, you can create your own schedule board.</br>
You can add 'card' and 'list' in the board for scheduling.

</br>

## How to Deploy

### Build Setup
1. **Mongo**, **node**, has to be installed in advance to run this application
2. Install modules
```bash
npm install
```
3. Make database directory if it doesn't in root directory of this project
```bash
mkdir database
```
4. Run mongod (For Windows10)
```bash
c:\mongodb\bin\mongod --dbpath ./database
```
5. Run seed.js (This is for making basic users of this application)
```bash
node seed
```
6. Start server
```bash
npm run dev
```
