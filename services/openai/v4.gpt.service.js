import OpenAI from "openai";
import config from "../../config.js";
// import fs from "fs";

const missionCreatePromt = (
  mission
) => `너는 플라스틱 쓰레기를 줍는 것에 대한 미션을 간략한 하나의 문장으로 생성해야 한다.

예를 들어, “페트병 5개 줍기”, “플라스틱 병뚜껑 3개 줍기”, “플라스틱 빨대 10개 모아오기” 와 같다.

쓰레기의 소재는 반드시 플라스틱이어야 하며, 미션 달성을 위한 개수를 반드시 포함해야 한다.

한국어로 미션을 생성해야 하며, ‘~기’ 로 끝맺어야 한다.`;

const analyzeImagePromt = `너는 플라스틱 쓰레기에 대한 미션이 담긴 문장과, 사용자가 제공한 이미지를 전달받아서,

사용자가 미션을 잘 수행했는지 판단하기 위해 이미지를 판독해야 한다.

미션은 “페트병 5개 줍기”, “플라스틱 병뚜껑 3개 줍기”, “플라스틱 빨대 10개 모아오기” 와 같은 형태로 이루어져 있다.

너는 사용자가 제공한 이미지에, 첫번째로 미션에서 제시한 플라스틱 쓰레기가 존재하는지 판단하고, 두번째로 쓰레기의 개수가 미션에 기재된 수량과 동일한지 판독해야 한다.

판독 결과 사용자가 미션에 적힌 대로 성공적으로 수행했다면 ‘True’를,

사용자가 미션에 적힌 2가지의 조건 중 하나라도 지키지 않았다면 ‘False’를 반환하라.

반드시 True 또는 False로만 답변해야 한다.

============

미션 내용: ${mission}
`;

const { API_KEY } = config.OPEN_AI;

const client = new OpenAI({
  apiKey: API_KEY,
});

// const imagePath = "/Users/codingroom/Downloads/gpt_sample.jpeg";
// const imageBuffer = fs.readFileSync(imagePath);
// const base64Image = imageBuffer.toString("base64");
// console.log(base64Image);

const getMission = async () => {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `${missionCreatePromt}`,
        },
      ],
    });

    console.log(completion);
    console.log(completion.choices[0].message);
    // console.log(JSON.stringify(completion.data, null, 2));
  } catch (error) {
    console.error("OpenAI API 요청 중 오류 발생:", error);
  }
};

const callOpenAIWithImage = async (mission, image) => {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: analyzeImagePromt(mission),
              // text: `사진을 설명해줘`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });
    // console.log(completion);
    console.log(completion.choices[0].message.content);
    console.log(JSON.stringify(completion.data, null, 2));
  } catch (error) {
    console.error("OpenAI API 요청 중 오류 발생:", error);
  }
};

callOpenAIWithImage(base64Image).then();

const generateImage = async () => {
  try {
    const image = await client.createImage({
      prompt: "A beautiful woman with long hair and a dress",
      n: 1,
      size: "1024x1024",
    });
    console.log(image.data.data[0].url);
  } catch (error) {
    console.error("OpenAI API 요청 중 오류 발생:", error);
  }
};
