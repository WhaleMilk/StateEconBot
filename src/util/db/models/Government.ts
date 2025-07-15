import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface GovernmentAttributes {
    guild_id: string;
    owner_id: string;
    balance: number;
    name: string,
    // field for trusted users
}

interface GovernmentCreationAttributes extends Optional<GovernmentAttributes, 'balance' | 'name'> {}

export class Government extends Model<GovernmentAttributes, GovernmentCreationAttributes> implements GovernmentAttributes {
    declare guild_id: string;
    declare owner_id: string;
    declare balance: number;
    declare name: string;
}

export function initGovernmentModel(sequelize: Sequelize): typeof Government {
    Government.init(
        {
            guild_id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            owner_id: {
                type: DataTypes.STRING,
                defaultValue: "none",
                allowNull: false,
            },
            balance: {
                type: DataTypes.INTEGER,
                defaultValue: 1000,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                defaultValue: 'none',
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: 'governments',
            tableName: 'governments',
            timestamps: false,
        }
    );
    return Government;
}