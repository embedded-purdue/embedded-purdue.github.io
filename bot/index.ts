import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { google } from "googleapis";
import { Redis } from "@upstash/redis";

const {
  DISCORD_TOKEN, DISCORD_APP_ID, DISCORD_GUILD_ID,
  GOOGLE_SA_EMAIL, GOOGLE_SA_PRIVATE_KEY,
  CALENDAR_ID, TIMEZONE, DISCORD_ANNOUNCE_CHANNEL_ID,
  UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
} = process.env;

const redis = new Redis({ url: String(UPSTASH_REDIS_REST_URL), token: String(UPSTASH_REDIS_REST_TOKEN) });

const commands = [
  new SlashCommandBuilder()
    .setName("addevent")
    .setDescription("Add a calendar event")
    .addStringOption(o => o.setName("title").setDescription("Title").setRequired(true))
    .addStringOption(o => o.setName("start").setDescription("Start ISO 2025-10-02T18:00").setRequired(true))
    .addStringOption(o => o.setName("end").setDescription("End ISO 2025-10-02T19:30").setRequired(true))
    .addStringOption(o => o.setName("location").setDescription("Location"))
    .addStringOption(o => o.setName("desc").setDescription("Description"))
    .toJSON(),
  new SlashCommandBuilder()
    .setName("editevent")
    .setDescription("Edit a calendar event")
    .addStringOption(o => o.setName("id").setDescription("Calendar event ID").setRequired(true))
    .addStringOption(o => o.setName("title").setDescription("New title"))
    .addStringOption(o => o.setName("start").setDescription("New start ISO"))
    .addStringOption(o => o.setName("end").setDescription("New end ISO"))
    .addStringOption(o => o.setName("location").setDescription("New location"))
    .addStringOption(o => o.setName("desc").setDescription("New description"))
    .toJSON(),
  new SlashCommandBuilder()
    .setName("deleteevent")
    .setDescription("Delete a calendar event")
    .addStringOption(o => o.setName("id").setDescription("Calendar event ID").setRequired(true))
    .toJSON(),
];

async function register() {
  const rest = new REST({ version: "10" }).setToken(String(DISCORD_TOKEN));
  await rest.put(Routes.applicationGuildCommands(String(DISCORD_APP_ID), String(DISCORD_GUILD_ID)), { body: commands });
}

function calendarClient() {
  const jwt = new google.auth.JWT(
    String(GOOGLE_SA_EMAIL), undefined,
    String(GOOGLE_SA_PRIVATE_KEY).replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/calendar.events"]
  );
  return google.calendar({ version: "v3", auth: jwt });
}

async function announceOrUpdateDiscord(calId: string, content: string) {
  const mapping = await redis.get<{ channelId: string; messageId: string }>(`cal:${calId}`);
  const headers = { "Authorization": `Bot ${DISCORD_TOKEN}`, "Content-Type": "application/json" };

  if (mapping?.messageId) {
    await fetch(`https://discord.com/api/v10/channels/${mapping.channelId}/messages/${mapping.messageId}`, {
      method: "PATCH", headers, body: JSON.stringify({ content }),
    });
  } else {
    const res = await fetch(`https://discord.com/api/v10/channels/${DISCORD_ANNOUNCE_CHANNEL_ID}/messages`, {
      method: "POST", headers, body: JSON.stringify({ content }),
    });
    if (res.ok) {
      const msg = await res.json();
      await redis.set(`cal:${calId}`, { channelId: msg.channel_id, messageId: msg.id });
    }
  }
}

async function onAdd(i: ChatInputCommandInteraction) {
  const title = i.options.getString("title", true);
  const start = i.options.getString("start", true);
  const end = i.options.getString("end", true);
  const location = i.options.getString("location") ?? undefined;
  const desc = i.options.getString("desc") ?? undefined;

  const cal = calendarClient();
  const ev = await cal.events.insert({
    calendarId: String(CALENDAR_ID),
    requestBody: {
      summary: title, description: desc, location,
      start: { dateTime: new Date(start).toISOString(), timeZone: String(TIMEZONE || "America/Indiana/Indianapolis") },
      end:   { dateTime: new Date(end).toISOString(),   timeZone: String(TIMEZONE || "America/Indiana/Indianapolis") },
    }
  });
  const id = ev.data.id!;
  const link = ev.data.htmlLink!;
  const when = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" })
    .format(new Date(ev.data.start?.dateTime || ev.data.start?.date!));
  await announceOrUpdateDiscord(id, `📅 **${title}**\n🕒 ${when}\n📍 ${location || "TBA"}\n\n${desc || ""}\n\n<${link}>`);
  await i.reply(`Created: ${link}\nID: \`${id}\``);
}

async function onEdit(i: ChatInputCommandInteraction) {
  const id = i.options.getString("id", true);
  const title = i.options.getString("title") ?? undefined;
  const start = i.options.getString("start") ?? undefined;
  const end = i.options.getString("end") ?? undefined;
  const location = i.options.getString("location") ?? undefined;
  const desc = i.options.getString("desc") ?? undefined;

  const cal = calendarClient();
  const get = await cal.events.get({ calendarId: String(CALENDAR_ID), eventId: id });
  const base = get.data;

  const updated = await cal.events.update({
    calendarId: String(CALENDAR_ID), eventId: id,
    requestBody: {
      ...base,
      summary: title ?? base.summary,
      description: desc ?? base.description,
      location: location ?? base.location,
      start: start ? { dateTime: new Date(start).toISOString(), timeZone: String(TIMEZONE) } : base.start,
      end:   end   ? { dateTime: new Date(end).toISOString(),   timeZone: String(TIMEZONE) } : base.end,
    }
  });

  const link = updated.data.htmlLink!;
  const when = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" })
    .format(new Date(updated.data.start?.dateTime || updated.data.start?.date!));
  await announceOrUpdateDiscord(id, `📅 **${updated.data.summary}**\n🕒 ${when}\n📍 ${updated.data.location || "TBA"}\n\n${updated.data.description || ""}\n\n<${link}>`);
  await i.reply(`Updated: ${link}`);
}

async function onDelete(i: ChatInputCommandInteraction) {
  const id = i.options.getString("id", true);
  const cal = calendarClient();
  await cal.events.delete({ calendarId: String(CALENDAR_ID), eventId: id });

  const mapping = await redis.get<{ channelId: string; messageId: string }>(`cal:${id}`);
  if (mapping?.messageId) {
    await fetch(`https://discord.com/api/v10/channels/${mapping.channelId}/messages/${mapping.messageId}`, {
      method: "DELETE", headers: { "Authorization": `Bot ${DISCORD_TOKEN}` },
    }).catch(() => {});
    await redis.del(`cal:${id}`);
  }
  await i.reply(`Deleted ${id}`);
}

async function main() {
  await register();
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  client.on("interactionCreate", async (i) => {
    if (!i.isChatInputCommand()) return;
    if (i.commandName === "addevent") return onAdd(i);
    if (i.commandName === "editevent") return onEdit(i);
    if (i.commandName === "deleteevent") return onDelete(i);
  });
  await client.login(String(DISCORD_TOKEN));
}
main().catch(console.error);