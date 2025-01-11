import { DataTypes, Model, Sequelize } from "sequelize";

class RelayUser extends Model {
  static init(sequelize) {
    return super.init(
      {
        relay_user_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        relay_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM("rewarded", "success", "fail", "in_progress"),
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
        tableName: "relay_user",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      as: "user",
      foreignKey: "user_id",
    });
    this.belongsTo(models.Relay, {
      as: "relay",
      foreignKey: "relay_id",
    });
  }
}

export default RelayUser;
