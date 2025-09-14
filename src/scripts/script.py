import discord
from discord.ext import commands
import datetime
from dotenv import load_dotenv
import os

load_dotenv()
bot_token = os.getenv("BOT_TOKEN")
intents = discord.Intents.default()
intents.message_content = True  # Enable message content intent if needed for commands
intents.guilds = True # Enable guild intent to access guild information
intents.guild_scheduled_events = True  # Enable the scheduled event intent


bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}')

@bot.event
async def on_scheduled_event_create(event):
    print(f"Scheduled Event Created: {event.name}")
    print(f"Guild: {event.guild.name}")
    print(f"Creator: {event.creator}")
    print(f"Start Time: {event.start_time}")
    print(f"Description: {event.description}")


@bot.command()
async def createevent(ctx, name, description, location, start_time_str, end_time_str=None):
    """
    Creates a scheduled event in the current guild.
    Usage: !createevent "Event Name" "Event Description" "location" "YYYY-MM-DD HH:MM" ["YYYY-MM-DD HH:MM"]
    """
    try:
        await ctx.send(f"Start time: {start_time_str}\nEnd time: {end_time_str}\n")
        # Parse start time
        start_time = datetime.datetime.strptime(start_time_str, "%Y-%m-%d %H:%M")
        # Make it timezone-aware (Discord expects UTC)
        start_time = start_time.replace(tzinfo=datetime.timezone.utc)
        # Parse end time if provided
        end_time = None
        if end_time_str:
            end_time = datetime.datetime.strptime(end_time_str, "%Y-%m-%d %H:%M")
            end_time = end_time.replace(tzinfo=datetime.timezone.utc)

        # Get the guild where the command was invoked
        guild = ctx.guild

        # Example: Create an event in a voice channel (replace with your desired channel)
        # You can also use discord.EntityType.external for external events and provide a location
        # For a voice channel event, you need to specify the channel ID
        voice_channel = discord.utils.get(guild.voice_channels, name="General") # Replace "General" with your channel name
        await ctx.send(f"voice channel?: {voice_channel}\n")
        
        if location:
            await guild.create_guild_scheduled_event(
                name=name,
                description=description,
                start_time=start_time,
                end_time=end_time,
                entity_type=discord.EntityType.external,
                location=location
            )
            await ctx.send(f"Event '{name}' created successfully in {voice_channel.name}!")
        else:
            await ctx.send("Voice channel 'General' not found. Please ensure it exists or specify a different channel.")

    except ValueError:
        await ctx.send("Invalid time format. Please use YYYY-MM-DD HH:MM.")
    except discord.Forbidden:
        await ctx.send("I don't have permission to create events.")
    except Exception as e:
        await ctx.send(f"An error occurred: {e}")

@bot.command()
async def hello(ctx):
    """Says hello to the user."""
    await ctx.send(f'Bye, {ctx.author.display_name}!')

# uses bot token to turn on bot
bot.run(bot_token)