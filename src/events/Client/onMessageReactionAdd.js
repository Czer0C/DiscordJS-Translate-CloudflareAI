const { success } = require('../../utils/Console')
const Event = require('../../structure/Event')
const { EmbedBuilder } = require('discord.js')

const KEY = `SGAAZ0070`

const API_TRANSLATE = `https://ru-to-en.zenze.workers.dev?key=${KEY}`

const ENGLISH_TAG = ['🇺🇸', '🇬🇧', '🇨🇦']

module.exports = new Event({
  event: 'messageReactionAdd',
  run: async (client, reaction, user) => {
    const flag = reaction.emoji.name

    const msg = reaction.message.content

    if (ENGLISH_TAG.includes(flag)) {
      if (!msg) {
        reaction.message.channel.send('The message was not cached ⚠️')
      } else {
        const inputs = {
          text: msg,
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
              name: reaction.message.author.tag,
              iconURL: reaction.message.author.avatarURL(),
            })

            reaction.message.channel.send({ embeds: [embed] })
          } else {
            reaction.message.channel.send('Failed to translate the text.')
          }
        } catch (error) {
          console.error(error)
        }
      }
    }
  },
}).toJSON()
