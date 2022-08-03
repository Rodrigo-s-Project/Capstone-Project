// import dialogflow from "@google-cloud/dialogflow";
// import path from "path";

// const projectId = "bimas-sc";
// const sessionId = "testing-session";

// const sessionClient: any = new dialogflow.SessionsClient({
//   keyFilename: path.join(
//     __dirname,
//     `../config/bimas-sc-0f8b010ce44b.json`
//   )
// });


// export const textQuery = async (userText: string, userId: string) => {
//   const sessionPath = sessionClient.projectAgentSessionPath(
//     projectId,
//     sessionId+userId
//   );

//   const request = {
//     session: sessionPath,
//     queryInput: {
//       text: {
//         text: userText,
//         languageCode: "en-US"
//       }
//     }
//   };

//   try {
//     const response = await sessionClient.detectIntent(request);
//     return response;
//   } catch (error) {
//     console.error("Error bot: ", error);
//     return "ERROR";
//   }
// };
