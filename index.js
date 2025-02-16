require('dotenv').config();
const { Bot } = require("grammy");

const bot = new Bot(process.env.BOT_API_KEY);

const startDate = new Date(Date.UTC(2024, 8, 16)); // Reference date for week calculation
let weekType;
let schedule = {
    1: {
        day: "Monday",
        lessons: {
            first: "Mathematical Analysis",
            second: "Programming Basics (Seminar)",
            third: "Computer Architecture"
        }
    },
    2: {
        day: "Tuesday",
        lessons: {
            first: "None",
            second: "None",
            third: "Linear Algebra"
        }
    },
    3: {
        day: "Wednesday",
        lessons: {
            first: "None",
            second: "Programming Basics",
            third: "English"
        }
    },
    4: {
        day: "Thursday",
        lessons: {
            first: "None",
            second: "Azerbaijani",
            third: "Programming Basics"
        }
    },
    5: {
        day: "Friday",
        lessons: {
            first: "Mathematical Analysis",
            second: "English",
            third: "None"
        }
    }
};

// Function to update schedule based on week type
function updateWeekType() {
    let currentDate = new Date();
    let dayDifference = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
    
    weekType = Math.ceil(dayDifference / 7) % 2 === 0 ? "down" : "up";

    if (weekType === "up") {
        schedule[2].lessons.second = "Linear Algebra (Seminar)";
        schedule[5].lessons.third = "Azerbaijani";
    } else {
        schedule[3].lessons.second = "Programming Basics";
        schedule[4].lessons.second = "Computer Architecture (Seminar)";
    }
}

// Function to send lesson schedule
async function sendDailySchedule(ctx) {
    updateWeekType();

    let currentTime = new Date();
    let currentHour = currentTime.getHours();
    let currentWeekday = currentTime.getDay(); // Sunday = 0, Monday = 1, ..., Friday = 5

    if (currentWeekday >= 1 && currentWeekday <= 5 && currentHour === 2) { // Only send from Monday to Friday at 2 AM
        let todaySchedule = schedule[currentWeekday];

        await ctx.reply(
            ` **Day:** ${todaySchedule.day}\n` +
            ` **Week Type:** ${weekType.toUpperCase()}\n` +
            ` **Lessons:**\n` +
            `   1️ ${todaySchedule.lessons.first}\n` +
            `   2️ ${todaySchedule.lessons.second}\n` +
            `   3️ ${todaySchedule.lessons.third}`
        );
    }

    // Schedule the function to run again after 1 minute
    setTimeout(() => sendDailySchedule(ctx), 60 * 1000);
}

// Bot command to start the schedule updates
bot.command("start", async (ctx) => {
    sendDailySchedule(ctx);
    await ctx.reply("✅ Schedule updates started! You will receive daily lesson schedules at 2 AM.");
});

// Start the bot
bot.start();
