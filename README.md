# EconBot (name WIP)

A discord bot written for Elanuelo and WindowBrick's state nation to simulate an economy. The bot allows users to exchange credits, create companies with which to buy land, and create governments to manage companies and users. The bot is written in Typescript which compiles down to Node.js code which is what actually runs. Everything is stored in a SQLite database for persistent storage.
## Commands
- `/register` — Registers a user into the economy
- `/balance [user]` Checks the balance of the specified user, or your own balance if a user isn't specified. 
- `/transfer [user] [amount]` transfers credits from the user running the command to the specified user. 
- `/register_government [name]` registers a government for the server (aka guild) the command is being run in. One government profile per guild. 

**Admin commands:**
- `/unregister_user [user]` removes user from database
- `/ping` it's a ping command
## Database Structure
- **Users Table:** Stores user IDs, balances, and government affiliations.
- **Governments Table:** Stores server (guild) IDs, owner IDs, balances, and government names.
- **Relationships:** One government can have many users; each user can belong to one government.
See [`src/util/db/README.md`](src/util/db/README.md) for more details on the database schema and usage examples.
## Setup

1. **Clone the Repo**
```bash 
    git clone <repo-url>
    cd EconBot 
```
2. **Install dependencies if needed**
3. **Configure environment variables:**
   - Create a `.env` file in the root directory.
   - Add your Discord bot token:
     ```
     DISCORD_TOKEN=your-bot-token-here
     ```
  
4. **Build the js from the typescript**
```bash
npm run build
```
5. **Run the bot**
```bash
npm run start
```

## Development

- Written in TypeScript.
- Uses Sequelize ORM for database management.
- Commands are modular and located in `src/commands/`.
