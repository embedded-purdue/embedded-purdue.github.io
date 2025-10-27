// lib/gcal.ts
import { google } from "googleapis";

const calendarId = process.env.GOOGLE_CALENDAR_ID;

function getJwtClient() {
  const email = process.env.GOOGLE_CLIENT_EMAIL!;
  const key = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
}

export async function listEvents(limit = 20) {
  const auth = getJwtClient();
  const cal = google.calendar({ version: "v3", auth });
  const now = new Date().toISOString();
  const { data } = await cal.events.list({
    calendarId,
    timeMin: now,
    maxResults: limit,
    singleEvents: true,
    orderBy: "startTime",
  });
  return (data.items ?? []).map((e) => ({
    id: e.id!,
    title: e.summary ?? "(untitled)",
    description: e.description ?? "",
    url: e.htmlLink ?? "",
    start: e.start?.dateTime ?? e.start?.date ?? "",
    end: e.end?.dateTime ?? e.end?.date ?? "",
  }));
}

type CreateEventInput = {
  title: string;
  description?: string;
  startISO: string;
  endISO: string;
  location?: string;
  attendees?: { email: string }[];
  url?: string;
};

export async function createEvent(input: CreateEventInput) {
  const auth = getJwtClient();
  const cal = google.calendar({ version: "v3", auth });
  const description = input.url
    ? `${input.description ?? ""}\n\nMore info: ${input.url}`
    : input.description ?? "";

  const { data } = await cal.events.insert({
    calendarId,
    requestBody: {
      summary: input.title,
      description,
      location: input.location,
      start: { dateTime: input.startISO },
      end: { dateTime: input.endISO },
      attendees: input.attendees,
    },
  });

  return { id: data.id, htmlLink: data.htmlLink };
}
