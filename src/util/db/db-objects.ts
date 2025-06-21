import { Government } from './models/Government';
import { User } from './models/Users';

export function setupAssociations() {
    // Government has many Users (one-to-many relationship)
    Government.hasMany(User, {
        foreignKey: 'government_id',
        sourceKey: 'guild_id',
        as: 'users'
    });

    // User belongs to one Government (many-to-one relationship)
    User.belongsTo(Government, {
        foreignKey: 'government_id',
        targetKey: 'guild_id',
        as: 'government'
    });
} 

