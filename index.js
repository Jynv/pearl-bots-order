const Discord = require("discord.js");
const config = require("./config.json")
const client = new Discord.Client({
  disableEveryone: true
  , partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.on("ready", ()=>console.log("READY"));




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
          .setColor("BLACK")
          .setTitle("Order")
          .setDescription("Rreact to order a Bot!")
          .setFooter("React with the emoji!")
      )
  }
  else if (cmd === "react"){
      message.channel.messages.fetch(args[0]).then(msg => message.react(args[1]));
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  const { message } = reaction;
  if(user.bot || !message.guild) return;
  if(message.partial) await message.fetch();
  if(reaction.partial) await reaction.fetch();
  
  if(message.guild.id === "806253420205572127" && message.channel.id === config.apply_channel_id && (reaction.emoji.name === "✅")){
      let guild = await message.guild.fetch();
      let channel_tosend = guild.channels.cache.get(config.finished_applies_channel_id);
      if(!channel_tosend) return console.log("RETURN FROM !CHANNEL_TOSEND");
      const answers = [];
      let counter = 0;

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
          .setFooter(user.name, user.displayAvatarURL({dynamic:true}))
          .setTimestamp()
          for(let i = 0; i < config.QUESTIONS.length; i++){
              try{
                  embed.addField(config.QUESTIONS[i], String(answers[i]).substr(0, 1024))
              }catch{
              }
          }
          channel_tosend.send(embed);
          user.send("Thanks for order a Bot at Paerl Bots:tm:")
      }
      

  }

})



const fs = require("fs");
const { Client, Collection, DiscordAPIError } = require("discord.js");
const { id } = require("common-tags");

client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on('ready', () => {
    console.log(`Der Bot ${client.user.tag} ist jetzt online!`);
    function randomStatus() {
       let status = ["v!help for help",  "Join now!", "Made by Pearl Bots™", "Order now a Bot!"]
       let rstatus = Math.floor(Math.random() * status.length);
       client.user.setActivity(status[rstatus],{type: "LISTEN TO"});
      };  setInterval(randomStatus, 30000)

   console.log('RichPresens is now activated!')
   })



   
client.on("message", async message => {
    const prefix = (config.prefix);
    if (message.author.bot) return;
    if (!message.guild) return;

    if (!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

   
    if (command) 
        command.run(client, message, args);

       
    
});

client.login(config.token);