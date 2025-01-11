import { DataTypes, Model, Sequelize } from "sequelize";

class Relay extends Model {
  static init(sequelize) {
    return super.init(
      {
        relay_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        mission: {
          type: DataTypes.STRING(1024),
          allowNull: false,
        },
        reward: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM("open", "closed", "in_progress"),
          allowNull: false,
        },
        current_country_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        next_country_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        client_relay_count: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        unique_country_count: {
          type: DataTypes.INTEGER,
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
        tableName: "relay",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Country, {
      as: "current_country",
      foreignKey: "current_country_id",
    });
    this.belongsTo(models.Country, {
      as: "next_country",
      foreignKey: "next_country_id",
    });
    this.hasMany(models.RelayUser, {
      as: "relay_users",
      foreignKey: "relay_id",
    });
  }
}

export default Relay;
