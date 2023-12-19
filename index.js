import dotenv from 'dotenv'
import { Markup, Telegraf } from 'telegraf'
import { menu } from './keyboards.js'

dotenv.config()
const bot = new Telegraf('token')
const PHONE_NUMBER = '+99373993938'
const CHANNEL_USERNAME = 'example'
const BOT_USERNAME = 'example'

function sendStartMenu(ctx) {
	ctx.reply(
		'💸Добро пожаловать в бот по продаже QIWI кошельков!',
		Markup.keyboard(menu.start).oneTime().resize()
	)
}
bot.start(ctx => sendStartMenu(ctx))
function pay(ctx, price) {
	ctx.replyWithHTML(
		`
Для получения товара оплатите этот товар.
В данный момент у нас есть только один
способ оплаты - это 🥝 QIWI.

📲 QIWI для оплаты: <code>${PHONE_NUMBER}</code>
💵 Сумма: <b>${price}р</b>
🗒 Комментарий для оплаты: <code>${ctx.message.from.id}</code>
`,
		Markup.inlineKeyboard([
			[Markup.button.callback('✅ Подтвердить оплату', 'verify')],
		])
	)
}

bot.hears('💰 Доступные кошельки', ctx =>
	ctx.reply(
		`
Добро пожаловать,выбирайте кошельки на любой вкус!

99 рублей: баланс от 300 рублей
149 рублей: баланс от 700 рублей
499 рублей: баланс от 1500 рублей `,
		Markup.keyboard(menu.wallets).oneTime().resize()
	)
)
bot.hears('💵 99 рублей', ctx => pay(ctx, 99))
bot.hears('💰 149 рублей', ctx => pay(ctx, 149))
bot.hears('🤑 1500 рублей', ctx => pay(ctx, 1500))
bot.hears('❌ Меню', ctx => sendStartMenu(ctx))
bot.hears('📱 Профиль', ctx =>
	ctx.replyWithHTML(
		`
📝 ID: <code>${ctx.message.from.id}</code>
🛍 Покупки: <i>Отсутствует</i>
`,
		Markup.inlineKeyboard([
			[Markup.button.callback('🔄 Обновить информацию', 'fake_update')],
		])
	)
)
bot.hears('🅾️ Отзывы', ctx =>
	ctx.reply(
		`Не верите, что мы честный бот по продаже кошельков?
Вы можете просмотреть отзывы покупателей и убедиться, что мы честные.`,
		Markup.inlineKeyboard([
			[Markup.button.url('🅾️ Отзывы', `https://t.me/${CHANNEL_USERNAME}`)],
		])
	)
)
bot.hears('👥 Партнеры', ctx =>
	ctx.replyWithHTML(
		`
Не хотите покупать QIWI кошельки?
Вы можете привлекать людей и получать процент от их покупок.

▫️ От 1 покупки реферала: 30%

По статистике каждый 5 в нашем боте покупает QIWI кошельки.
Из 10 привлечённых людей 2 точно будут покупать кошельки.

Ваша реферальная ссылка: https://t.me/${BOT_USERNAME}?start=${ctx.message.from.id}
`,
		{
			disable_web_page_preview: true,
		}
	)
)

bot.action('verify', ctx =>
	ctx.reply('❌ Оплата не найдена, проверьте наличие комментария ')
)
bot.action('fake_update', ctx => ctx.reply('Профиль обновлён.'))

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
