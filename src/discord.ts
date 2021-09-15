import { Client, Intents, TextBasedChannels } from 'discord.js';

const channels = [
    { channelId: '835639918868561951', name: 'Amy' },
    { channelId: '835639956121583638', name: 'Rick' },
    { channelId: '835639981145587752', name: 'Carmen' },
    { channelId: '835640040549253160', name: 'Finn' },
    { channelId: '835640076284723240', name: 'Kim' },
    { channelId: '835640103472332811', name: 'Jim' },
    { channelId: '835640135009828884', name: 'Marisa' }
];

export interface Quote {
    content: string;
    answer: string;
}

interface DiscordBot {
    fetchQuotes: () => Promise<Array<Quote>>;
}

export const startDiscordBot = (token: string): DiscordBot => {
    const bot = new Client({intents: [Intents.FLAGS.GUILDS]});

    bot.on('ready', () => {
        console.log(`Logged in as ${bot.user?.tag}!`);
    });

    bot.login(token);

    return {
        fetchQuotes: async () => {
            let allMessages: Quote[] = [];
            for await (const { channelId, name } of channels) {                
                const channel = await bot.channels.fetch(channelId) as TextBasedChannels;
                const messages = await getAllMessages(channel);
                console.log(messages);
                allMessages = [
                    ...allMessages,
                    ...messages.map(m => ({
                        content: m,
                        answer: name
                    }))
                ]
            }
            return allMessages;
        }
    };
}

const getAllMessages = async (channel: TextBasedChannels): Promise<Array<string>> => {
    if (!channel) return [];
    const messages = await channel.messages.fetch({ limit: 100 });
    return messages
        .filter(m => m.author.id === '122101294033797122')
        .map(m => m.content);
}