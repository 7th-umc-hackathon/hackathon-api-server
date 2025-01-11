import bcrypt from 'bcrypt';
import {
    User, Relay, RelayUser, Country, sequelize, Sequelize
} from "../../models.index.js";

const seedDatabase = async () => {
    // Country 데이터 이미 있음 (이미 삽입되어 있다고 가정)

    // 유저 데이터 삽입
    const user1 = await User.create({
        login_id: 'user1',
        password: await bcrypt.hash('password1', 10),
        name: '김일안',
        nickname: '얀1',
        email: 'user1@email.com',
        country_id: 1,
        point: 100,
        created_at: new Date(),
        updated_at: new Date(),
    });

    const user2 = await User.create({
        login_id: 'user2',
        password: await bcrypt.hash('password2', 10),
        name: '김이안',
        nickname: '얀2',
        email: 'user2@email.com',
        country_id: 2,
        point: 200,
        created_at: new Date(),
        updated_at: new Date(),
    });

    const user3 = await User.create({
        login_id: 'user3',
        password: await bcrypt.hash('password3', 10),
        name: '김삼안',
        nickname: '얀3',
        email: 'user3@email.com',
        country_id: 3,
        point: 300,
        created_at: new Date(),
        updated_at: new Date(),
    });

    const user4 = await User.create({
        login_id: 'user4',
        password: await bcrypt.hash('password4', 10),
        name: '김사안',
        nickname: '얀4',
        email: 'user4@email.com',
        country_id: 4,
        point: 400,
        created_at: new Date(),
        updated_at: new Date(),
    });

    // 릴레이 데이터 삽입
    const relay = await Relay.create({
        mission: '미션 내용1',
        reward: 1,
        status: 'open',  // 상태는 'open', 'closed', 'in_progress' 중 하나
        current_country_id: countries[0].country_id,  // 첫 번째 국가를 현재 국가로 설정
        next_country_id: countries[1].country_id,     // 두 번째 국가를 다음 국가로 설정
        client_relay_count: 5,
        unique_country_count: 3,
        created_at: new Date(),
        updated_at: new Date(),
      });
};