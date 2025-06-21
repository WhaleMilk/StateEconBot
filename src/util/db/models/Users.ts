import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface UserAttributes {
  user_id: string;
  balance: number;
  government_id?: string; // Foreign key to government
}

interface UserCreationAttributes extends Optional<UserAttributes, 'balance' | 'government_id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare user_id: string;
  declare balance: number;
  declare government_id?: string;
}

export function initUserModel(sequelize: Sequelize): typeof User {
  User.init(
    {
      user_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      balance: {
        type: DataTypes.INTEGER,
        defaultValue: 1000,
        allowNull: false,
      },
      government_id: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: 'governments',
          key: 'guild_id'
        }
      },
    },
    {
      sequelize,
      modelName: 'users',
      tableName: 'users',
      timestamps: false,
    }
  );
  return User;
}