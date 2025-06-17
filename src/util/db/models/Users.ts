import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface UserAttributes {
  user_id: string;
  balance: number;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'balance'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare user_id: string;
  declare balance: number;
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