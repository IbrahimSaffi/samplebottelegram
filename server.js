const { Telegraf } = require('telegraf')
const express = require("express")
const cors = require('cors')
require('dotenv').config()
const app = express()
app.use(cors({ origin: "*" }))
const bot = new Telegraf('5699809193:AAHYziujok-YHkt1iO5Y1E8GHbQl0vrlwfw');
const fetch = require('node-fetch');
let myToken = "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"
bot.launch();
bot.telegram.setMyCommands([{ command: 'set_updates', description: 'Starting Automated Update' }])
let allSubbedRepos =[]
bot.command('set_updates', (ctx) => {
    let channelName = ""
    let repoLink = ""
    ctx.reply("Kindly make this bot admin of channel and then replay with channel id in format @<Channel Id>")
    bot.on("message", (ctx) => {
        if (!ctx.message.text.startsWith("@") && channelName === "") {
            ctx.reply("Incorrect Channel Id")
        }
        else if (ctx.message.text.startsWith("@") && channelName==="") {
            channelName = ctx.message.text
            ctx.reply("Got it! Now please enter repo link")
        }
        else {
            repoLink = ctx.message.text.split("https://github.com/")[1]
            console.log(`https://api.github.com/repos/${repoLink}`)
            ctx.reply("Congragulations!Now You will recieve regular updates from this repo")
            try {
                getRepoData(channelName, repoLink)
                let subbedRepo = {}
                subbedRepo.channelName=channelName
                subbedRepo.repoLink=repoLink
                channelName=""
                repoLink=""
                allSubbedRepos.push(subbedRepo)
                setInterval(() => {
                    try {
                        console.log(subbedRepo)
                        allSubbedRepos.forEach(subbedRepo=>getRepoData(subbedRepo.channelName, subbedRepo.repoLink))
                    }
                    catch (err) {
                        ctx.reply("Please make bot adming of channel")
                    }
                }, 10000)
            }
            catch (err) {
                ctx.reply("Please make bot admin of channel")
            }
        }
    }
    )
})
function getRepoData(channelName, repoLink) {
    fetch(`https://api.github.com/repos/${repoLink}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/vnd.github.text-match+json',
        },
        auth: myToken
    }).then(response => response.json()).then((data) => {
        console.log(data)
        bot.telegram.sendMessage(channelName, `Hi, I hope everyone is doing fine\nThis is an automated update\nForks: ${data.forks_count}\nSubscribers:${data.subscribers_count}\nBookmarks:${data.stargazers_count}\nLast_update:${data.updated_at}\nOpen_issues:${data.open_issues_count}
            `)
    })
}
app.listen(process.env.PORT || 8000)
