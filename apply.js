const Discord = require("discord.js");
const config = requirde("./config.json")
const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});

ODE3NjY1MTI4MDQ4MjMwNDIw.YEMz_g.mU12_9g4V02Gf58xUze4UZXMpoQ

const config = {
    "token": "TOKEN",
    "prefix": "p!",
   
   
    "apply_channel_id": "806255071498076232",
    "finished_applies_channel_id": "814431968392773663",
    
    
    "QUESTIONS": [
        "1) Bot Name:",
        "2) Bot Prefix:",
        "3) **1** oder **2** Bewerbungssysteme:",
        "4) Fragen für das **.1** Bewerbungssystem:",
        "5) **ggf** Fragen für das **2.** Bewerbungssystem:",
        "6) Embed Farbe:",
        "7) Bot Profilbild:"
    ]
}

client.on("message", (message)=>{
    if(message.author.bot || !message.guild) return;
    if(!message.content.startsWith(config.prefix)) return;
    let args = message.content.slice(config.prefix.length).split(" ");
    let cmd = args.shift();

    if(cmd === "embed"){
        console.log(args)
        let newargs = args.join(" ").split("+")
        console.log(newargs)
        message.channel.send(
            new Discord.MessageEmbed()
            .setColor('#ff0505')
            .setTitle("Order")
            .setDescription("React to this message to order a Bot!")
            .setFooter("React with the emoji!")
        )
    }
    else if (cmd === "react"){
        message.channel.messages.fetch(args[0]).then(msg => msg.react(args[1]));
    }
});

client.on("messageReactionAdd", async (reaction, user, args) => {
    const { message } = reaction;
    if(user.bot || !message.guild) return;
    if(message.partial) await message.fetch();
    if(reaction.partial) await reaction.fetch();
    
    if(message.guild.id === "806253420205572127" && message.channel.id === config.apply_channel_id && (reaction.emoji.name === '✅')){
        let guild = await message.guild.fetch();
        let channel_tosend = guild.channels.cache.get(config.finished_applies_channel_id);
        if(!channel_tosend) return console.log("RETURN FROM !CHANNEL_TOSEND");
        const answers = [];
        let counter = 0;
        } 

        ask_question(config.QUESTIONS[counter]);

        function ask_question(qu){
            if(counter === config.QUESTIONS.length) return send_finished();
            user.send(qu).then(msg => {
                msg.channel.awaitMessages(m=>m.author.id === user.id, {max: 1, time: 60000, errors: ["time"]}).then(collected => {
                    answers.push(collected.first().content);
                    ask_question(config.QUESTIONS[++counter]);
                })
            })
        }
        function send_finished(){
            let embed = new Discord.MessageEmbed()
            .setColor("BLACK")
            .setTitle("A new order from: " + user.tag) 
            .setDescription(`${user}  |  ${new Date()}`)
            .setFooter(user.id, user.displayAvatarURL({dynamic:true}))
            .setTimestamp()
            for(let i = 0; i < config.QUESTIONS.length; i++){
                try{
                    embed.addField(config.QUESTIONS[i], String(answers[i]).substr(0, 1024))
                }catch{
                }
            }
            channel_tosend.send(embed);
            user.send("Thanks for order a Bot from Pearl Bots:tm:")
           
            
        }
        

    }

})



client.login(config.token);
