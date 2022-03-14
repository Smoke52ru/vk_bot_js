import Markup from 'node-vk-bot-api/lib/markup.js'

export class KB {
    constructor(buttons, settings) {
        this.markup = Markup
            .keyboard(buttons.map((b) => Markup.button(b, 'primary')), settings)
    }
}

export default KB;