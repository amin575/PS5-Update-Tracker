export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("PS5 Updates Bot is running.");
    }

    try {
      const update = await request.json();
      const message = update.message;

      if (!message || !message.text) {
        return new Response("OK");
      }

      const text = message.text.trim();

      if (!text.startsWith("/updates")) {
        return new Response("OK");
      }

      const chatId = message.chat.id;

      const ps5 = await getFile("ps5_latest.txt");
      const warzone = await getFile("warzone_latest.txt");
      const fortnite = await getFile("fortnite_latest.txt");
      const gtavi = await getFile("gtavi_latest.txt");
      const fc27 = await getFile("fc27_latest.txt");

      await sendTelegram(
        env.BOT_TOKEN,
        chatId,
        ps5
      );

      await sendTelegram(
        env.BOT_TOKEN,
        chatId,
        warzone
      );

      await sendTelegram(
        env.BOT_TOKEN,
        chatId,
        fortnite
      );

      await sendTelegram(
        env.BOT_TOKEN,
        chatId,
        gtavi
      );

      await sendTelegram(
        env.BOT_TOKEN,
        chatId,
        fc27
      );

      return new Response("OK");

    } catch (error) {
      console.log(error);
      return new Response("ERROR", { status: 500 });
    }
  }
};


async function sendTelegram(token, chatId, text) {
  await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text
      })
    }
  );
}


async function getFile(filename) {
  const url =
    `https://raw.githubusercontent.com/amin575/PS5-Update-Tracker/main/${filename}?t=${Date.now()}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "PS5-Updates-Bot",
      "Cache-Control": "no-cache"
    },
    cf: {
      cacheTtl: 0,
      cacheEverything: false
    }
  });

  if (!response.ok) {
    return "اطلاعات هنوز در GitHub ذخیره نشده.";
  }

  return await response.text();
}
