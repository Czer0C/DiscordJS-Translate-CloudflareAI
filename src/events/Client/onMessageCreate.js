const { success } = require('../../utils/Console')
const Event = require('../../structure/Event')
const { EmbedBuilder } = require('discord.js')

const KEY = `SGAAZ0070`

const API_TRANSLATE = `https://ru-to-en.zenze.workers.dev?key=${KEY}`

module.exports = new Event({
  event: 'messageCreate',
  run: async (client, message) => {
    if (message.author.bot) return

    const inputs = {
      text: message.content,
      source_lang: 'ru',
      target_lang: 'en',
    }

    try {
      const res = await fetch(API_TRANSLATE, {
        method: 'POST',
        body: JSON.stringify(inputs),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await res.json()

      const translatedText = data?.response?.translated_text

      if (translatedText) {
        const embed = new EmbedBuilder()

        embed.setColor('#FF0000')
        embed.setDescription(translatedText)
        embed.setAuthor({
          name: message.author.tag,
          iconURL: message.author.avatarURL(),
        })

        message.channel.send({ embeds: [embed] })
      } else {
        // message.reply('Failed to translate the text.')
      }
    } catch (error) {
      console.error(error)
    }
  },
}).toJSON()
