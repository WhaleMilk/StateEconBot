const { Op, Sequelize } = require('sequelize');
const {Client, codeBlock, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
//const {Users} = require('./dbObjects.js');

const client = new Client({intents: [GatewayIntentBits.Guilds]});
const currency = new Collection();

async function addBalance(id, amount) {
    const user = currency.get(id);

    if (user) {
        user.balance += Number(amount);
        return user.save();
    }

    return createUser(id);
}

async function createUser(id) {
    const newUser = await Users.create({user_id: id});
    curruency.set(id, newUser);
    return newUser;
}

function getBalance(id) {
    const user = currency.get(id);
    return user ? user.balance : 0;
}

client.once(Events.Ready, async () => {
    const storedBalances = await Users.findAll();
    storedBalances.forEach(b => currency.set(b.user_id, b));
    
    console.log('Ready! Logged in as ${client.user.tag}');
})

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'balance') {
        const target = interaction.options.getUser('user') || interaction.user;

        return interaction.reply('${target.tag} has ${getBalance(target.id)} credits');
    } else if (commandName === 'transfer') {
        const currentAmount = getBalance(interaction.user.id);
        const transferAmount = interaction.options.getInteger('amount');
        const transferTarget = interaction.options.getUser('user');

        if(transferAmount > currentAmount) return interaction.reply('You do not have enough for that transaction');
        if(transferAmount <= 0) return interaction.reply('Please enter a value greater than 0');

        addBalance(interaction.user.id, -transferAmount);
        addBalance(transferTarget.id, transferAmount);

        return interaction.reply('Transfer of ${transferAmount} credits to ${transferTarget.tag}.');
    } else if (commandName === 'register') {
        if(currency.get(interaction.user.id)) return interaction.reply('You already have a profile');
        createUser(interaction.user.id);
        return interaction.reply('New profile created for user ${interaction.user.tag}');
    } else if (commandName === 'shutdown') {
        await client.destroy();
        process.exit(0);
    }
});

client.login(token);