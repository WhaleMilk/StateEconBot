import { Government, User } from './db-init';

/**
 * Example functions demonstrating the Government-User relationship
 */

// Add a user to a government
export async function addUserToGovernment(userId: string, guildId: string): Promise<void> {
    try {
        // First, ensure the government exists
        const government = await Government.findByPk(guildId);
        if (!government) {
            throw new Error(`Government with guild_id ${guildId} not found`);
        }

        // Update or create the user with the government_id
        await User.upsert({
            user_id: userId,
            government_id: guildId,
            balance: 1000 // Default balance
        });

        console.log(`User ${userId} added to government ${guildId}`);
    } catch (error) {
        console.error('Error adding user to government:', error);
        throw error;
    }
}

// Remove a user from a government
export async function removeUserFromGovernment(userId: string): Promise<void> {
    try {
        await User.update(
            { government_id: undefined },
            { where: { user_id: userId } }
        );
        console.log(`User ${userId} removed from government`);
    } catch (error) {
        console.error('Error removing user from government:', error);
        throw error;
    }
}

// Get all users in a government
export async function getUsersInGovernment(guildId: string): Promise<InstanceType<typeof User>[]> {
    try {
        const government = await Government.findByPk(guildId, {
            include: [{
                model: User,
                as: 'users'
            }]
        });

        if (!government) {
            throw new Error(`Government with guild_id ${guildId} not found`);
        }

        // Type assertion for the association
        return (government as any).users || [];
    } catch (error) {
        console.error('Error getting users in government:', error);
        throw error;
    }
}

// Get the government a user belongs to
export async function getUserGovernment(userId: string): Promise<InstanceType<typeof Government> | null> {
    try {
        const user = await User.findByPk(userId, {
            include: [{
                model: Government,
                as: 'government'
            }]
        });

        // Type assertion for the association
        return (user as any)?.government || null;
    } catch (error) {
        console.error('Error getting user government:', error);
        throw error;
    }
}

// Get all governments with their user counts
export async function getGovernmentsWithUserCounts(): Promise<Array<{ government: InstanceType<typeof Government>, userCount: number }>> {
    try {
        const governments = await Government.findAll({
            include: [{
                model: User,
                as: 'users',
                attributes: [] // Don't include user data, just count
            }]
        });

        return governments.map(gov => ({
            government: gov,
            userCount: (gov as any).users?.length || 0
        }));
    } catch (error) {
        console.error('Error getting governments with user counts:', error);
        throw error;
    }
} 