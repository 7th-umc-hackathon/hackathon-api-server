import { DataTypes, Model, Sequelize } from "sequelize";

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        user_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        login_id: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING(512),
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(512),
          allowNull: false,
        },
        nickname: {
          type: DataTypes.STRING(512),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(512),
          allowNull: false,
        },
        country_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        point: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
        },
        updated_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
        },
      },
      {
        sequelize,
        tableName: "user",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Country, {
      as: "country",
      foreignKey: "country_id",
    });
    this.hasMany(models.RelayUser, {
      as: "relay_users",
      foreignKey: "user_id",
    });
  }
}

export default User;
