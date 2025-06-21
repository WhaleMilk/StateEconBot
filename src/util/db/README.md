# Database Relationships

This document describes the database relationships in the EconBot application.

## Government-User Relationship

The application now supports a one-to-many relationship between Governments and Users:

- **One Government** can have **Many Users**
- **One User** can belong to **One Government** (or no government)

### Database Schema

#### Governments Table
- `guild_id` (Primary Key) - The Discord guild/server ID
- `owner_id` - The Discord user ID of the government owner
- `balance` - The government's balance

#### Users Table
- `user_id` (Primary Key) - The Discord user ID
- `balance` - The user's personal balance
- `government_id` (Foreign Key) - References `governments.guild_id`

### Usage Examples

#### Adding a User to a Government
```typescript
import { addUserToGovernment } from './relationship-examples';

await addUserToGovernment('user123', 'guild456');
```

#### Removing a User from a Government
```typescript
import { removeUserFromGovernment } from './relationship-examples';

await removeUserFromGovernment('user123');
```

#### Getting All Users in a Government
```typescript
import { getUsersInGovernment } from './relationship-examples';

const users = await getUsersInGovernment('guild456');
console.log(`Government has ${users.length} users`);
```

#### Getting a User's Government
```typescript
import { getUserGovernment } from './relationship-examples';

const government = await getUserGovernment('user123');
if (government) {
    console.log(`User belongs to government: ${government.guild_id}`);
} else {
    console.log('User does not belong to any government');
}
```

#### Getting All Governments with User Counts
```typescript
import { getGovernmentsWithUserCounts } from './relationship-examples';

const governments = await getGovernmentsWithUserCounts();
governments.forEach(({ government, userCount }) => {
    console.log(`Government ${government.guild_id} has ${userCount} users`);
});
```

### Direct Sequelize Usage

You can also use Sequelize associations directly:

```typescript
import { Government, User } from './db-init';

// Get government with all its users
const government = await Government.findByPk('guild456', {
    include: [{
        model: User,
        as: 'users'
    }]
});

// Get user with their government
const user = await User.findByPk('user123', {
    include: [{
        model: Government,
        as: 'government'
    }]
});
```

### Migration Notes

When you run the application for the first time with this new relationship:

1. The database will automatically create the new `government_id` column in the `users` table
2. Existing users will have `government_id` set to `NULL` (no government)
3. You can assign users to governments using the provided utility functions

### Important Notes

- Users can exist without belonging to any government (`government_id` can be `NULL`)
- A user can only belong to one government at a time
- The relationship is enforced at the database level with foreign key constraints
- When a government is deleted, users belonging to that government will have their `government_id` set to `NULL` 